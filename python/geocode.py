#!/usr/bin/env python3
import os
import sys
import psycopg2
from geocodio import GeocodioClient, client
import json
import time
import signal

API_KEY = "d1310b9b9eb7d5916bbd6443d66d0be7e7d4034"
geocode_rate = 100  # per hour (100 per hour is within free tier limit)
connection = None


def main():
    global connection
    geocode_client = GeocodioClient(API_KEY)
    while True:
        try:
            connection = psycopg2.connect(
                user=os.getenv("DB_USER") or "postgres",
                password=os.getenv("DB_PASSWORD") or "postgres",
                host=os.getenv("DB_HOST") or "127.0.0.1", port="5432", database="smart")
            break

        except Exception as e:
            print(e)
            # just wait for postgres to be ready
            time.sleep(10)

    while True:
        try:
            updated_permit = geocode_permit(geocode_client)
            connection.commit()
            if (updated_permit == False):
                # all permits have lat/lon, don't check for at least a minute
                time.sleep(60)
        except Exception as e:
            print("EXCEPTION: ", e)
        time.sleep(3600/geocode_rate)


def geocode_permit(geocode_client):
    global connection
    cursor = connection.cursor()
    # create source in db
    sql = 'SELECT id, street_number, street, city, state FROM permits where location is NULL AND location_accuracy is NULL AND street IS NOT NULL and city IS NOT NULL limit 1'
    cursor.execute(sql)
    permit_info = cursor.fetchone()
    if (permit_info is None):
        print("no permits need geocoding")
        return False
    id = permit_info[0]
    address = " ".join(permit_info[1:])
    print(f"Getting Address for permit {id}: {address}")

    # use geocode API, get 2500 free requests per day
    response = geocode_client.geocode(address)
    if len(response['results']) == 0:
        # no results, set loc accuracy to zero so we can skip and goto next addr
        print("No location returned from geocodio API")
        sql = "UPDATE public.permits SET location_accuracy=%s, geocode_data=%s where id=%s"
        cursor.execute(sql, (0, json.dumps(response), id))
        return True

    formatted_addr = response['results'][0]['formatted_address']
    print("Found: " + formatted_addr)
    loc = response['results'][0]['location']
    acc = response.accuracy
    acc_type = response['results'][0]['accuracy_type']
    print(
        f"Coord: ({loc['lat']}, {loc['lng']}) with accuracy: {acc * 100}% {acc_type}")

    # sanitize lat and lng as they are injected into sql string directly
    try:
        lat = float(loc['lat'])
        lng = float(loc['lng'])
    except:
        print("WARN: lat or lng was not a float. Geocode API is acting weird. Refusing to write to database")
        print("Bad respose: " + response)
        return

    # update database
    sql = f"UPDATE public.permits SET location=ST_GeomFromText('POINT({lng} {lat})')"
    sql += ", formatted_address=%s, location_accuracy=%s, geocode_data=%s where id=%s"

    cursor.execute(sql, (formatted_addr, acc, json.dumps(response), id))

    # also geocode any duplicates
    sql = f"UPDATE public.permits SET location=ST_GeomFromText('POINT({lng} {lat})')"
    sql += ", formatted_address=%s, location_accuracy=%s, geocode_data=%s where "
    sql += "street_number=%s AND street=%s AND city=%s AND state=%s"

    cursor.execute(sql, (formatted_addr, acc, json.dumps(
        response), permit_info[1], permit_info[2], permit_info[3], permit_info[4]))

    if cursor.rowcount > 1:
        print("geolocated ", cursor.rowcount-1, " duplicates of this address")
    connection.commit()
    cursor.close()
    return True


def on_container_stop(*args):
    connection.close()
    sys.exit(0)


signal.signal(signal.SIGTERM, on_container_stop)
if __name__ == '__main__':
    main()
