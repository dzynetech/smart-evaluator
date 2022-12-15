#!/usr/bin/env python

import json
import math 
import sys
import os
import time
import os.path

def offset(lon, lat, mx, my):
    earth = 6378.137  # radius of the earth in kilometer
    pi = math.pi
    m = (1 / ((2 * pi / 360) * earth)) / 1000  # 1 meter in degree

    new_latitude = lat + (my * m)
    new_longitude = lon + (mx * m) / math.cos(lat * (pi / 180))
    return [new_longitude, new_latitude]


def download_images(filename_data):
    files_info = []
    id = 0

    with open(filename_data) as f:
        data = json.load(f)
    
    total_sites = len(data["data"]["permits"]["edges"])
    for site in data["data"]["permits"]["edges"]:
        node =  site['node']
        site_id = str(node['id'])
        lat = float(node['location']['y'])
        lon = float(node['location']['x'])
        bbox = json.loads(node['permitData'])["bbox"]
        #print(bbox)

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
        #print(xmin, ymin, xmax, ymax)

        id = id + 1

        image_results = ""
        host = "https://resonantgeodata.dev"
        #cmd = "rdwatch movie --bbox {} {} {} {} --start-time 2021-04-01T15:51:26 --end-time 2021-08-01T15:51:26 --output {}.avif".format(xmin, ymin, xmax, ymax, site_id)
        #cmd = "rdwatch movie --bbox {} {} {} {} --start-time 2021-04-01T15:51:26 --end-time 2021-08-01T15:51:26 --worldview true --output {}.avif".format(xmin, ymin, xmax, ymax, site_id)
        #cmd = "rdwatch movie --bbox {} {} {} {} --start-time 2016-01-01 --end-time 2022-06-01 --output {}.avif".format(xmin, ymin, xmax, ymax, site_id)

        directory = "12_06_22"

        if centery < 33.787975 or centerx < 125.320439:
            #print("Not in Korea, skipping")
            continue

        print("\n===============================================")
        print("Requesting images for site: ", str(id+1)+"/"+str(total_sites), site_id, lat, lon)

        check_filename = "{}/{}.avif".format(directory, site_id)
        if os.path.exists(check_filename):
            print("WorldView file found, skipping")
            continue
        check_filename = "{}/{}.no_worldview".format(directory, site_id)
        #if os.path.exists(check_filename):
        #    print("WorldView already requested and failed, skipping")
        #    continue

        # get the start time
        st = time.time()
        cmd = "/root/.local/bin/rdwatch movie --bbox {} {} {} {} --host  {} --start-time 2014-01-01 --end-time 2022-12-01 --worldview --output {}/{}.avif".format(xmin, ymin, xmax, ymax, host, directory, site_id)
        print(cmd)
        result = os.system(cmd)
        # get the end time
        et = time.time()
        elapsed_time = et - st
        print('Execution time:', elapsed_time, 'seconds')

        if result != 0:
            print("Failed to fenerate WorldView video")
            cmd = "touch {}/{}.no_worldview".format(directory,site_id)
            result = os.system(cmd)
            '''
            cmd = "rdwatch movie --bbox {} {} {} {} --host  {} --start-time 2017-01-01 --end-time 2022-12-01 --output 12_06_22/sentinel/{}.avif".format(xmin, ymin, xmax, ymax, host, site_id)
            print(cmd)
            result = os.system(cmd)
            if result != 0:
                print("Failed to fenerate Sentinel 2 video")
            else:
                image_results = "Sentinel2"
                print("Generated Sentinel 2 video")
            '''
        else:
            image_results = "WorldView"
            print("Generated WorldView video")

        if image_results != "":
            #cmd = 'ffmpeg -y -i {}.avif -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2, setpts=200*PTS" {}.mp4'.format(site_id, site_id)
            #print(cmd)
            cmd = 'ffmpeg -y -i {}.avif -vf "scale=\'min(800,trunc(iw/2)*2)\':-2, setpts=200*PTS" {}/{}.mp4'.format(site_id, directory, site_id)
            #print(cmd)
            #os.system(cmd)
        

if __name__=="__main__":
    download_images(sys.argv[1])
