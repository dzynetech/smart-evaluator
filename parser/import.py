#!/usr/bin/env python3
import csv
import json
import uuid
import psycopg2


def main():
    # read config
    config = {}
    config_file = "config.json"
    with open(config_file) as f:
        config = json.load(f)

    # a unique id for each invocation of this script, for tracking import and rollbacks
    import_id = uuid.uuid4().hex[:16]
    print("import id: " + import_id)
    connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="smart")
    cursor = connection.cursor()
    # create source in db
    sql = f"INSERT INTO sources(name) VALUES('{config['dataset_name']}') RETURNING id"
    cursor.execute(sql)
    source_id = cursor.fetchone()[0]

    # insert permit data
    if config['has_lat_long']:
        # TODO: using string formatting is not recommended because of sql injection and parsing issues
        # but POSTGRIS doesn't work well with format strings..maybe only format the POINT part?

        sql = """ INSERT INTO permits (location,cost,sqft,street_number,street,city,state,source_id,import_id, permit_data) 
                VALUES (ST_GeomFromText('POINT({} {})'),{},{},'{}','{}','{}','{}','{}','{}','{}') """
    else:
        sql = """ INSERT INTO permits (cost,sqft,street_number,street,city,state,source_id, import_id, permit_data) 
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) """

    headers = []
    with open(config['filename']) as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            if len(headers) == 0:
                headers = row
                continue
            if len(row) == 0:
                continue
            cost = row[config['cost_col']] or 'null'
            if "." in cost:
                cost = cost[:cost.find('.')]
            sq_ft = row[config['sq_ft_col']] or 'null'
            if "." in sq_ft:
                sq_ft = sq_ft[:sq_ft.find('.')]
            latitude = None
            longitude = None
            if config['has_lat_long']:
                latitude = row[config['latitude']]
                longitude = row[config['longitude']]
            street_number = row[config['street_number_col']] or None
            # json.dumps escapes single quotes
            street = (row[config['street_col']]).replace("'", "")
            city = row[config['city_col']]
            state = row[config['state_col']]
            permit_data = create_permit_json(headers, row)
            # point_wkt = f"ST_GeomFromText('POINT({latitude},{longitude})',4326)"
            # print(point_wkt)
            if config['has_lat_long']:
                data = (longitude, latitude, cost, sq_ft,
                        street_number, street, city, state, source_id, import_id, permit_data)
                query = sql.format(*data)
                cursor.execute(query)
            else:
                data = (cost, sq_ft, street_number,
                        street, city, state, source_id, import_id, permit_data)
                cursor.execute(sql, data)

    connection.commit()
    cursor.close()
    connection.close()


def create_permit_json(headers, row):
    data = {}
    for h, d in zip(headers, row):
        data[h] = d
    return json.dumps(data)


if __name__ == "__main__":
    main()
