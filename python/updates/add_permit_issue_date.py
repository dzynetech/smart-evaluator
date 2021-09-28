#!/usr/bin/env python3
import os
import psycopg2
import json
import time
import signal
from datetime import datetime


def main():
    connection = psycopg2.connect(
        user=os.getenv("DB_USER") or "postgres",
        password=os.getenv("DB_PASSWORD") or "postgres",
        host=os.getenv("DB_HOST") or "127.0.0.1", port="5432", database="smart")

    cursor = connection.cursor()
    # create source in db
    sql = 'SELECT id, permit_data FROM permits where source_id = 8'
    cursor.execute(sql)
    rows = cursor.fetchall()

    for row in rows:
        id, permit_data = row
        # print(id)
        data = json.loads(permit_data)
        date = data["Issue Date"]
        # print(date)
        d = datetime.strptime(date, '%m/%d/%y')
        # print(d)
        date_string = d.strftime("%Y-%m-%d")
        # print(date_string)
        update_sql = "UPDATE public.permits SET permit_issue_date=%s where id=%s"
        cursor.execute(update_sql, (date_string, id))

    connection.commit()
    cursor.close()


if __name__ == '__main__':
    main()
