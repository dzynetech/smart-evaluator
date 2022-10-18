#!/usr/bin/env python3
from datetime import datetime
import os
import json
from time import time
import uuid
import psycopg2
from flask import Flask, request
from flask_cors import CORS


meters_to_sqft = 10.76391042
import_id = uuid.uuid4().hex[:16]

app = Flask(__name__)
CORS(app)

while True:
    try:
        connection = psycopg2.connect(
            user=os.getenv("DB_USER") or "postgres",
            password=os.getenv("DB_PASSWORD") or "postgres",
            host=os.getenv("DB_HOST") or "127.0.0.1", port="5432", database="smart")
        cursor = connection.cursor()
        break
    except psycopg2.OperationalError:
        print("Waiting for database to start up...")
        time.sleep(1)



@app.route('/ingest', methods = ['POST','OPTIONS'])
def upload_file():
    if request.method != 'POST':
        return ""
    f = request.files['file']
    source = request.form['source']
    try:
        user_id = request.form['user_id']
    except:
        user_id = None
    try:
        count = ingest(f.stream,source,user_id)
    except Exception as e:
        return json.dumps({'error': str(e) })
    return json.dumps({'success': f"Imported {count} permits." })
		


def ingest(f,source,user_id):
    try:
        with f:
            data = json.load(f)
            sites = data['results']
        print("Import ID:",import_id)

        sql = f"INSERT INTO smart.sources(name) VALUES(%s) RETURNING id"
        cursor.execute(sql,(source,))
        source_id = cursor.fetchone()[0]

        if user_id is not None:
            # give this user access to that source
            sql = f"INSERT INTO smart_private.users_sources (user_id,source_id) VALUES(%s,%s)"
            cursor.execute(sql,(user_id,source_id))

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
        # cursor.close()
        # connection.close()
        return len(sites)
    except psycopg2.DatabaseError as e:
        cursor.execute("ROLLBACK")
        raise e

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
    app.run(host="0.0.0.0", port=4199)
