#!/usr/bin/env python3
import os
import sys
import json
import uuid
import psycopg2

source_id = 12
meters_to_sqft = 10.76391042
def main():

    connection = psycopg2.connect(
        user=os.getenv("DB_USER") or "postgres",
        password=os.getenv("DB_PASSWORD") or "postgres",
        host=os.getenv("DB_HOST") or "127.0.0.1", port="5432", database="smart")
    cursor = connection.cursor()

    with open('jacksonville.geojson') as f:
        data = json.load(f)

    features = data['features']
    for feat in features:
        props = feat['properties']
        del props['region_mod']
        geojson = json.dumps(feat['geometry'])
        permit_data = json.dumps(props)
        sql = "INSERT INTO permits (bounds, permit_data,source_id,import_id,cost,sqft,city,state,street,zip,name) "
        sql += "VALUES (ST_GeomFromGeoJSON(%s),%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id;"
        cursor.execute(sql, (geojson, permit_data,
                       source_id, 0, 0, props['area'] * meters_to_sqft, "", "", "", "", props['site_id']))
        id = cursor.fetchone()[0]
        print(id)
        sql = "UPDATE permits SET location = ST_Centroid(bounds) where id=%s"
        cursor.execute(sql, (id,))


    connection.commit()
    cursor.close()
    connection.close()
    return


if __name__ == "__main__":
    main()
