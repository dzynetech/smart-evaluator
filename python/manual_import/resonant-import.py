#!/usr/bin/env python3
from datetime import datetime
import os
import sys
import json
import uuid
import psycopg2

meters_to_sqft = 10.76391042
import_id = uuid.uuid4().hex[:16]


def main():

    if len(sys.argv) < 2:
        print("pass file to import")
        exit(1)

    connection = psycopg2.connect(
        user=os.getenv("DB_USER") or "postgres",
        password=os.getenv("DB_PASSWORD") or "postgres",
        host=os.getenv("DB_HOST") or "127.0.0.1", port="5432", database="smart")
    cursor = connection.cursor()

    with open(sys.argv[1]) as f:
        data = json.load(f)
        sites = data['results']
    print("Import ID:",import_id)

    sql = f"INSERT INTO smart.sources(name) VALUES('{sys.argv[1]}') RETURNING id"
    cursor.execute(sql)
    source_id = cursor.fetchone()[0]

    for site in sites:
        site_id = site['site']
        permit_data = json.dumps(site)
        area = 0
        cost = 0
        issue_date = datetime.fromtimestamp(site['timestamp'])
        geojson = json.dumps(bbox_to_geojson(site['bbox']))
        image_url ='test'

        sql = "INSERT INTO smart.permits (bounds,permit_data,source_id,import_id,image_url,issue_date,cost,sqft,city,state,street,street_number,zip,name,notes) "
        sql += "VALUES (ST_Multi(ST_GeomFromGeoJSON(%s)),%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id;"
        cursor.execute(sql, (geojson, permit_data,
                       source_id, import_id, image_url, issue_date,cost, area * meters_to_sqft, "", "", "", "", "", site_id, ""))
        id = cursor.fetchone()[0]
        print(id)
        sql = "UPDATE smart.permits SET location = ST_Centroid(bounds) where id=%s"
        cursor.execute(sql, (id,))

    connection.commit()
    cursor.close()
    connection.close()


def bbox_to_geojson(bbox):
    geojson = {
        'type': "MultiPolygon",
        'coordinates': [[[]]],
    }
    bounds = []
    bounds.append([bbox['xmin'],bbox['ymin']])
    bounds.append([bbox['xmin'],bbox['ymax']])
    bounds.append([bbox['xmax'],bbox['ymax']])
    bounds.append([bbox['xmax'],bbox['ymin']])
    bounds.append([bbox['xmin'],bbox['ymin']])

    geojson['coordinates'] = [[bounds]]
    return geojson

if __name__ == "__main__":
    main()
