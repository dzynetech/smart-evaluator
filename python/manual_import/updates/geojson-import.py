#!/usr/bin/env python3
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
        try:
            if "CRS84" not in data['crs']['properties']['name'] != "":
                import geopandas
                gdf = geopandas.read_file("epgs32619.geojson")
                gdf_wgs84 = gdf.to_crs("epsg:4326")
                json_reprojected = gdf_wgs84.to_json(indent=2)
                data = json.loads(json_reprojected)

        except:
            # just assume json is in EPGS84 format already
            pass

    sql = f"INSERT INTO smart.sources(name) VALUES('{sys.argv[1]}') RETURNING id"
    cursor.execute(sql)
    source_id = cursor.fetchone()[0]

    features = data['features']
    for feat in features:
        props = feat['properties']
        try:
            del props['region_mod']
        except:
            pass
        if props['type'] == "region":
            continue
        try:
            site_id = props['site_id']
        except:
            continue
        geojson = json.dumps(feat['geometry'])
        permit_data = json.dumps(props)
        try:
            area = props['area']
        except:
            area = 0
        sql = "INSERT INTO smart.permits (bounds, permit_data,source_id,import_id,cost,sqft,city,state,street,street_number,zip,name,notes) "
        sql += "VALUES (ST_Multi(ST_GeomFromGeoJSON(%s)),%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id;"
        cursor.execute(sql, (geojson, permit_data,
                       source_id, import_id, 0, area * meters_to_sqft, "", "", "", "", "", site_id, ""))
        id = cursor.fetchone()[0]
        print(id)
        sql = "UPDATE smart.permits SET location = ST_Centroid(bounds) where id=%s"
        cursor.execute(sql, (id,))

    connection.commit()
    cursor.close()
    connection.close()
    return


if __name__ == "__main__":
    main()
