#!/usr/bin/env python3
import os
import sys
import psycopg2
import time
import signal
import math
import json
import pathlib


def main():
    global connection
    while True:
        try:
            connection = psycopg2.connect(
                user=os.getenv("DB_USER") or "postgres",
                password=os.getenv("DB_PASSWORD") or "postgres",
                host=os.getenv("DB_HOST") or "127.0.0.1", port="5432", database="smart")
            break

        except Exception as e:
            print(e)
            # just wait for postgres to be ready
            time.sleep(10)

    login()
    print("Starting moviegen routine")
    while True:
        try:
            did_update_permit = moviegen_permit()
            if not did_update_permit:
                cooldown_s = 60
                # print(f"No permits to generate videos for. Will recheck in {cooldown_s} seconds.")
                time.sleep(cooldown_s)
        except Exception as e:
            print("EXCEPTION: ", e)
            time.sleep(3)


def moviegen_permit():
    global connection
    cursor = connection.cursor()
    # create source in db
    sql = 'SELECT id,name, ST_X (ST_Transform (location, 4326)) AS long, ST_Y (ST_Transform (location, 4326)) AS lat, source_id, permit_data, moviegen_retry FROM smart.permits where moviegen is true AND moviegen_retry < 3 limit 1'
    cursor.execute(sql)
    result = cursor.fetchone()
    if (result is None):
        return False
    id, name, lng, lat, source_id, permit_data, retry_count = result
    print(f"Generating video for permit {id}: {name} ({lat},{lng})")
    try:
        sql = 'SELECT  ST_AsGeoJSON(ST_Envelope(bounds)) from smart.permits where id=%s'
        cursor.execute(sql, (id,))
        bound_json = cursor.fetchone()[0]
        bound = json.loads(bound_json)
        bbox = {
            "xmin": bound['coordinates'][0][0][0],
            "ymin": bound['coordinates'][0][0][1],
            "xmax": bound['coordinates'][0][2][0],
            "ymax": bound['coordinates'][0][1][1],
        }
        xmin, ymin, xmax, ymax = normalize_bounds(lat, lng, bbox)

        host = os.getenv("RDWATCH_HOST") or "https://resonantgeodata.dev"

        directory = "output"
        if os.path.exists("/data"):
            directory = os.path.join("/data", f"moviegen_{source_id}")
            try:
                os.makedirs(directory)
            except FileExistsError:
                pass

        st = time.time()
        cmd = "/usr/local/bin/rdwatch movie --bbox {} {} {} {} --host  {} --start-time 2014-01-01 --end-time 2022-12-01 --worldview --output {}/{}.avif".format(
            xmin, ymin, xmax, ymax, host, directory, id)
        print(cmd)
        result = os.system(cmd)
        # get the end time
        et = time.time()
        elapsed_time = et - st
        print('Execution time:', elapsed_time, 'seconds')

        if result != 0:
            raise Exception("rdwatch gave non-zero exit code")

        video_name = f"{id}.mp4"
        print(f"Generated video for {id}.")

        print("Converting avif to mp4")
        cmd = 'ffmpeg -y -i {}/{}.avif -vf "scale=\'min(800,trunc(iw/2)*2)\':-2, setpts=200*PTS" {}/{}.mp4'.format(
            directory, id, directory, id)
        print(cmd)
        os.system(cmd)

        if directory != "output":
            src = pathlib.PurePath(directory).name
            src = os.path.join(src, video_name)
            dest = os.path.join("/data", video_name)
            print(f"Symlinking {src} to {dest}")
            os.symlink(src, dest)

        print("Updating Database")
        sql = "UPDATE smart.permits SET moviegen=false,image_url=%s WHERE id=%s"
        cursor.execute(sql, (video_name, id))
        connection.commit()
        cursor.close()
        print("Complete")

    except Exception as e:
        print("EXCEPTION:", e)
        print(f"Failed to generate video for {id}. Setting retry to: {retry_count+1}")
        sql = "UPDATE smart.permits SET moviegen_retry = moviegen_retry + 1 WHERE id=%s"
        cursor.execute(sql, (id,))
        connection.commit()
        cursor.close()

    return True


def offset(lon, lat, mx, my):
    earth = 6378.137  # radius of the earth in kilometer
    pi = math.pi
    m = (1 / ((2 * pi / 360) * earth)) / 1000  # 1 meter in degree

    new_latitude = lat + (my * m)
    new_longitude = lon + (mx * m) / math.cos(lat * (pi / 180))
    return [new_longitude, new_latitude]


# normalize_bounds take an existing bbox and expands it to be a north up
# about 16 by 9ish frame for a video
def normalize_bounds(lat, lon, bbox):
    mx = 470
    my = 275
    coords = []
    coords.append(offset(lon, lat, -mx, -my))
    coords.append(offset(lon, lat, -mx, +my))
    coords.append(offset(lon, lat, mx, +my))
    coords.append(offset(lon, lat, mx, -my))
    coords.append(offset(lon, lat, -mx, -my))

    xmin = bbox["xmin"]
    ymin = bbox["ymin"]
    xmax = bbox["xmax"]
    ymax = bbox["ymax"]
    #print(xmin, ymin, xmax, ymax)

    centerx = (xmin + xmax)/2
    centery = (ymin + ymax)/2

    width = xmax - xmin
    height = ymax - ymin

    width = width * 2
    height = height * 2

    if width > height:
        width = width * 2.1
        height = width * 0.5
    else:
        height = height * 1.2
        width = height / 0.5

    xmin = centerx - width/2
    ymin = centery - height/2
    xmax = centerx + width/2
    ymax = centery + height/2
    return (xmin, ymin, xmax, ymax)


def login():
    home = str(pathlib.Path.home())
    login_data = {
        'username': os.getenv("RDWATCH_USERNAME"),
        'password': os.getenv("RDWATCH_PASSWORD")
    }
    try:
        os.makedirs(f"{home}/.config")
    except FileExistsError:
        pass
    with open(f"{home}/.config/rdwatch", 'w') as f:
        json.dump(login_data, f)


def on_container_stop(*args):
    connection.close()
    sys.exit(0)


signal.signal(signal.SIGTERM, on_container_stop)
if __name__ == '__main__':
    main()
