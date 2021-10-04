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
    config_file = "permits/boston/config.json"
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
    sql = f"INSERT INTO smart.sources(name) VALUES('{config['dataset_name']}') RETURNING id"
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
    excluded_rows = []
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
                if col == "zip" and value is not None:
                    while len(value) < 5:
                        value = "0" + value
                if col == "sqft" and value is None:
                    value = 0
                if col == "cost" and value is None:
                    value = 0
                data.append(value)
            columns.append("import_id")
            data.append(import_id)
            columns.append("source_id")
            data.append(source_id)
            columns.append("permit_data")
            data.append(create_permit_json(headers,  row))

            # parse out street no from street if there is no street number
            if "street_number" not in sql_columns:
                full_street = data[columns.index('street')]
                street_number, street = full_street.strip().split(" ", 1)
                data[columns.index('street')] = street
                data.append(street_number)
                columns.append("street_number")

            # exclude rows that are missing too much data to geolocate
            required = ["street_number", "street", "city", "state"]
            for col in required:
                if data[columns.index(col)] is None or len(data[columns.index(col)]) == 0:
                    row.append(col)
                    excluded_rows.append(row)
                    break

            # add name column
            columns.append("name")
            data.append(name_row(columns, data))

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

            sql = f"INSERT INTO smart.permits {tuple(columns)}".replace(
                "'",  "")
            sql += " VALUES (" + first_value + "%s," * (len(data)-1) + "%s);"
            cursor.execute(sql, tuple(data))

    connection.commit()
    print("Import Complete. id: " + import_id)
    cursor.close()
    connection.close()
    if len(excluded_rows) > 0:
        filename = "excluded_" + \
            config['dataset_name'] + "_" + import_id + ".csv"
        print(len(excluded_rows), " rows were not imported. Saving these rows to ", filename)
        with open(filename, 'w', encoding='UTF8') as f:
            writer = csv.writer(f)
            writer.writerow(headers + ["reason for exclusion"])
            for row in excluded_rows:
                writer.writerow(row)


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


def name_row(columns, data):
    street = data[columns.index('street')]
    street_no = data[columns.index('street_number')]
    city = data[columns.index('city')]
    state = data[columns.index('state')]
    zip = data[columns.index('zip')]

    if (street_no == "" or street == "" or street_no is None or street is None):
        return f"{city}, {state} {zip}"

    return f"{street_no} {street}, {city}, {state} {zip}"



if __name__ == "__main__":
    main()
