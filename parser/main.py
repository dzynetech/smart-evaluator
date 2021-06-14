#!/usr/bin/env python3
import csv
import psycopg2

def main():

    connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host="127.0.0.1",
                                  port="5432",
                                  database="smart")
    cursor = connection.cursor()
    sql = """ INSERT INTO permits (location,cost,sqft,street_number,street,city,state) 
                VALUES (ST_GeomFromText('POINT({} {})'),{},{},{},'{}','{}','{}') """


    filename = "Loudoun_2017_2019.csv"
    with open(filename) as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        next(reader) #skip header line
        for row in reader:
            cost = row[10] or 'null'
            sq_ft = row[9] or 'null'
            latitude = row[11]
            longitude = row[12]
            street_number =row[15] or 'null'
            street = row[16]
            city = row[19]
            state = row[20]

            # point_wkt = f"ST_GeomFromText('POINT({latitude},{longitude})',4326)"
            # print(point_wkt)
            data = (longitude,latitude,cost,sq_ft,street_number,street,city,state)
            query = sql.format(*data)
            cursor.execute(query)

    connection.commit() 
    cursor.close()
    connection.close()
  
if __name__ == "__main__":
    main()
