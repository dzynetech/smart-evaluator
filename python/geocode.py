#!/usr/bin/env python3
import os
import psycopg2
from geocodio import GeocodioClient, client
import json
import time
import signal

API_KEY = "d1310b9b9eb7d5916bbd6443d66d0be7e7d4034"
geocode_rate = 100  # per hour (100 per hour is within free tier limit)
connection = None
bad_permit_ids = []


def main():
	global connection
	geocode_client = GeocodioClient(API_KEY)
	connection = psycopg2.connect(
            user=os.getenv("DB_USER") or "postgres",
            password=os.getenv("DB_PASSWORD") or "postgres",
            host=os.getenv("DB_HOST") or "127.0.0.1", port="5432", database="smart")


	while True:
		updated_permit = geocode_permit(geocode_client)
		if (updated_permit == False):
			# all permits have lat/lon, don't check for at least a minute
			time.sleep(60)
		time.sleep(3600/geocode_rate)


def geocode_permit(geocode_client):
	global connection
	cursor = connection.cursor()
	# create source in db
	sql = 'SELECT id,street_number, street, city, state FROM "permits" where location is NULL '
	for permit_id in bad_permit_ids:
		sql += f"AND NOT id={permit_id} "
	sql += "limit 1"
	cursor.execute(sql)
	permit_info = cursor.fetchone()
	if (permit_info is None):
		# no permits need geocoding
		return False
	id = permit_info[0]
	address = None
	try:
		address = " ".join(permit_info[1:])
		print(f"Getting Address for permit {id}: {address}")
	except:
		print(f"Permit {id} has no address. ")
		bad_permit_ids.append(id)
		return

	# use geocode API, get 2500 free requests per day
	response = geocode_client.geocode(address)
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
	connection.commit()
	cursor.close()
	return True


def on_container_stop():
	connection.close()


signal.signal(signal.SIGTERM, on_container_stop)
if __name__ == '__main__':
	main()
