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
    query = """ INSERT INTO permits (latitude,longitude,cost,sqft,street_number,street,city,state) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) """


    filename = "Loudoun_2017_2019.csv"
    with open(filename) as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        next(reader) #skip header line
        for row in reader:
           cost =optional(row[10])
           sq_ft = optional(row[9])
           latitude = row[11]
           longitude = row[12]
           street_number =optional(row[15])
           street = row[16]
           city = row[19]
           state = row[20]
           data = (latitude,longitude,cost,sq_ft,street_number,street,city,state)
           cursor.execute(query,data)

    connection.commit() 
    cursor.close()
    connection.close()
  
def optional(x: int):
    try:
        return int(x)
    except ValueError:
        return None


if __name__ == "__main__":
    main()
