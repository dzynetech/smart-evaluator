#!/usr/bin/env python3
import json
import argparse
import csv
import os


def main():
    parser = argparse.ArgumentParser(
        description='script to generate import configuration.')
    parser.add_argument('filename', metavar="FILENAME", type=str,
                        help="csv file to analyze")
    parser.add_argument('--generate', action='store_true',
                        default=False, help="generate config.json for the given file")
    parser.add_argument(
        '--check', help="check an existing config.json",  metavar='CONFIG_FILE')
    args = parser.parse_args()
    headers = []
    data = []

    with open(args.filename) as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        for row in reader:
            if len(headers) == 0:
                headers = row
                continue
            if len(row) == 0:
                continue
            data = row
            if not args.check:
                break
            check_config(args.check,  data)

    if args.check:
        return
    rows = tuple(zip(headers, data))
    print("\033[1m{:<5} {:<20} {:<10}\033[0m".format(
        "Index", "Header", "Data"))
    for i, h in enumerate(headers):
        print("{:<5} {:<20} {:<10}".format(i, h, data[i]))

    if not args.generate:
        print("run as 'python -i SCRIPTNAME' to interact with headers, data, and rows")
        print("run with '--generate' to  generate a config.json for this file")
        exit()
    json_data = {}
    json_data['filename'] = os.path.basename(args.filename)

    json_data['dataset_name'] = input("Enter a name for this dataset: ")

    sql_columns = ['cost', 'sq_ft', 'street_number', 'street',
                   'city', 'state', 'zip', 'latitude', 'longitude', 'location_accuracy']

    for name in sql_columns:
        valid = False
        while not valid:
            response = input("which index is " + name + "? [s to skip]  ")
            try:
                col_number = int(response)
                json_data[name + "_col"] = col_number
                valid = True
            except:
                if response.lower() in ['s', 'skip']:
                    valid = True
                print("Please enter an integer")

    print("Sample entry:\n")
    print_sample(data,  json_data)

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


def sampledata(column, data, json_data):
    column += "_col"
    if column in json_data:
        return data[json_data[column]]
    return f"[no {column}]"


def print_sample(data,  json_data):
    print(f"{sampledata('sq_ft',data,json_data)} sq ft, ${sampledata('cost',data,json_data)}")
    print(f"{sampledata('street_number',data,json_data)} {sampledata('street',data,json_data)}")
    print(f"{sampledata('city',data,json_data)}, {sampledata('state',data,json_data)} {sampledata('zip',data,json_data)}")
    print(f"({sampledata('latitude',data,json_data)},{sampledata('longitude',data,json_data)})")
    print(

        f"Accuracy: {float(sampledata('location_accuracy',data,json_data)) * 100}%")


def check_config(config_file, data):
    config_data = {}
    with open(config_file, 'r') as f:
        config_data = json.load(f)
    print()
    print_sample(data,  config_data)
    print()
    key = input("Press any key for next result. [Q] to quit. ")
    if key.lower() in ['q', 'quit']:
        exit(0)


if __name__ == "__main__":
    main()
