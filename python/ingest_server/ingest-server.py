#!/usr/bin/env python3
from datetime import datetime
import os
import json
import signal
import sys
import time 
import uuid
import psycopg2
from flask import Flask, request
from flask_cors import CORS
import requests 


meters_to_sqft = 10.76391042

connection = None
app = Flask(__name__)
CORS(app)

while True:
    try:
        connection = psycopg2.connect(
            user=os.getenv("DB_USER") or "postgres",
            password=os.getenv("DB_PASSWORD") or "postgres",
            host=os.getenv("DB_HOST") or "127.0.0.1", port="5432", database="smart")
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
        data = json.load(f.stream)
        count = ingest(data,source,user_id)
    except Exception as e:
        return json.dumps({'error': str(e) })
    return json.dumps({'success': f"Imported {count} permits." })
		

@app.route('/autoingest', methods = ['POST','OPTIONS'])
def autoingest():
    if request.method != 'POST':
        return ""

    source = request.json['source']
    user = request.json['username']
    password = request.json['password']
    url = request.json['url']
    try:
        user_id = request.json['user_id']
    except:
        user_id = None

    # get json file from url
    session = requests.Session()
    session.auth = (user, password)
    try:
        response = session.get(url)
        if response.status_code == 401:
            return json.dumps({'error': 'Bad username or password'})
    except:
        return json.dumps({'error': 'Connection to URL failed.' })


    # do actual ingest
    try:
        count = ingest(response.json(),source,user_id)
    except Exception as e:
        return json.dumps({'error': str(e) })
    return json.dumps({'success': f"Imported {count} permits." })


def ingest(data,source,user_id):
    try:
        cursor = connection.cursor()
        import_id = uuid.uuid4().hex[:16]
        print("Import ID:",import_id)

        try:
            sites = data['results']
        except (KeyError,TypeError):
            return new_ingest(data,import_id,source,user_id)

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
    finally:
        cursor.close()

def is_site(x):
    try:
        return x['properties']['type'] == "site"
    except:
        return False

def new_ingest(data,import_id,source,user_id):
    try:
        print("Failing over to new ingest")
        cursor = connection.cursor()

        sql = f"INSERT INTO smart.sources(name) VALUES(%s) RETURNING id"
        cursor.execute(sql,(source,))
        source_id = cursor.fetchone()[0]

        if user_id is not None:
            # give this user access to that source
            sql = f"INSERT INTO smart_private.users_sources (user_id,source_id) VALUES(%s,%s)"
            cursor.execute(sql,(user_id,source_id))

        for feature_site in data:
            features = feature_site['features']
            site = None
            for f in features:
                if is_site(f):
                    site = f
                    break

            try:
                site_id = site['properties']['site_id']
            except:
                site_id = "???"
            permit_data = json.dumps(site)
            area = 0
            cost = 0
            issue_date = site['properties']['start_date']
            geojson = json.dumps(site['geometry'])
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
        return len(data)
    except psycopg2.DatabaseError as e:
        cursor.execute("ROLLBACK")
        cursor.close()
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


def on_container_stop(*args):
    print("Stopping...")
    if cursor is not None:
        print("curosr close")
        cursor.close()
    if connection is not None:
        print("con colse")
        connection.close()
    sys.exit(0)


signal.signal(signal.SIGTERM, on_container_stop)
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=4199)
