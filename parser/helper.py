#!/usr/bin/env python3
import json
import argparse
import csv
import os

parser = argparse.ArgumentParser(
    description='Helper to generate config.yml.')
parser.add_argument('filename', metavar="FILENAME", type=str)
parser.add_argument('--generate', action='store_true', default=False)
args = parser.parse_args()
headers = []
data = []
dir = None

with open(args.filename) as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
        if len(headers) == 0:
            headers = row
            continue
        if len(row) == 0:
            continue
        data = row
        break

rows = tuple(zip(headers, data))
for i, h in enumerate(headers):
    print("{:<4} {:<20} {:<10}".format(i, h, data[i]))

if not args.generate:
    print("run as 'python -i SCRIPTNAME' to interact with headers, data, and rows")
    exit()
json_data = {}
json_data['filename'] = os.path.basename(args.filename)
json_data['has_lat_long'] = False

json_data['dataset_name'] = input("Enter a name for this dataset: ")
sql_columns = ['cost', 'sq_ft', 'street_number',
               'street', 'city', 'state', 'zip']

for name in sql_columns:
    valid = False
    while not valid:
        response = input("which index is " + name + "?\t")
        try:
            col_number = int(response)
            json_data[name + "_col"] = col_number
            valid = True
        except:
            if not response.isspace():
                print("Please enter an integer")

#sample
print("Sample entry:\n")
print(f"{data[json_data['sq_ft_col']]} sq ft, ${data[json_data['cost_col']]}")
print(f"{data[json_data['street_number_col']]} {data[json_data['street_col']]}")
print(
    f"{data[json_data['city_col']]}, {data[json_data['state_col']]} {data[json_data['zip_col']]}")

ans = input("\nDoes this look correct [Y/n]? ")
if (ans != "Y" and ans != 'y'):
    print("Aborting...")
    exit()

json_file = os.path.join(os.path.dirname(args.filename), "config.json")
print("Writing config to "+json_file)
with open(json_file, 'w') as f:
    f.seek(0)
    json.dump(json_data, f, indent=4)
    f.truncate()
