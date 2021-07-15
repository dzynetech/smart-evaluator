#!/usr/bin/env python3
import os
import sys
import csv
import json
import uuid
import psycopg2


def main():
    # read config
    config = {}
    config_file = "config.json"
    if len(sys.argv) > 1:
        config_file = sys.argv[1]
    with open(config_file) as f:
        config = json.load(f)

    # a unique id for each invocation of this script, for tracking import and rollbacks
    import_id = uuid.uuid4().hex[:16]

    connection = psycopg2.connect(
        user=os.getenv("DB_USER") or "postgres",
        password=os.getenv("DB_PASSWORD") or "postgres",
        host=os.getenv("DB_HOST") or "127.0.0.1", port="5432", database="smart")
    cursor = connection.cursor()
    # create source in db
    sql = f"INSERT INTO sources(name) VALUES('{config['dataset_name']}') RETURNING id"
    cursor.execute(sql)
    source_id = cursor.fetchone()[0]

    sql_columns = []
    for key in config:
        if key[-4:] == "_col":
            sql_columns.append(key[:-4])

    has_lat = ('latitude' in sql_columns)
    has_long = ('longitude' in sql_columns)
    if has_lat != has_long:
        print("ERROR: cannot have only latitude or only longitude")
        return

    headers = []
    csv_path = os.path.join(os.path.dirname(config_file),  config['filename'])
    with open(csv_path) as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            if len(headers) == 0:
                headers = row
                continue
            if len(row) == 0:
                continue

            data = []
            columns = sql_columns[:]
            for col in columns:
                value = sanitize(row[config[col + "_col"]]) or None
                data.append(value)
            # skip if this is a duplicate
            try:
                dup_check = "SELECT id,street_number,street,city,state,zip FROM permits where street_number=%s and street=%s and city=%s and state=%s"
                street_no = data[columns.index('street_number')]
                street = data[columns.index('street')]
                city = data[columns.index('city')]
                state = data[columns.index('state')]
                cursor.execute(dup_check, (street_no, street, city, state))
                dup = cursor.fetchone()
                if (dup is not None):
                    continue
            except:
                pass  # some column is missing, so just import that location regardless
            columns.append("import_id")
            data.append(import_id)
            columns.append("source_id")
            data.append(source_id)
            columns.append("permit_data")
            data.append(create_permit_json(headers,  row))

            first_value = ""
            if has_lat and has_long:
                lat_idx = columns.index('latitude')
                long_idx = columns.index('longitude')
                lat = data[lat_idx]
                long = data[long_idx]
                del columns[long_idx]
                del columns[lat_idx]
                del data[long_idx]
                del data[lat_idx]
                columns.insert(0,  'location')
                first_value = f"ST_GeomFromText('POINT({long} {lat})'),"

            sql = f"INSERT INTO permits {tuple(columns)}".replace("'",  "")
            sql += " VALUES (" + first_value + "%s," * (len(data)-1) + "%s);"
            cursor.execute(sql, tuple(data))
            connection.commit()

    print("Import Complete. id: " + import_id)
    cursor.close()
    connection.close()


def create_permit_json(headers, row):
    data = {}
    for h, d in zip(headers, row):
        data[h] = d
    return json.dumps(data)


def sanitize(value: str):
    # sanitize the value coming in from csv
    if (value == False):
        return value
    value = value.replace("$", "")
    maybe_num = value.replace(",", "")
    try:
        num = float(maybe_num)
        # succeeded
        value = maybe_num
    except:
        pass
    return value


if __name__ == "__main__":
    main()
