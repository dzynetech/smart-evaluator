## Importing a new dataset

Datasets come in as CSV files, and must be converted into permit entries in the postgres database. This is done by creating a configuration file per CSV that standardizes what csv rows map to the rows in postgres.

configure.py is a utilty for creating a config.json file for a given CSV. Run it with the csv as a parameter to scrape out the headers as well as a sample data entry. running with the `--generate` flag will ask the user to map the CSV headers to postgres columns and then will output a config file.

import.py uses the config file and the csv file together to import the data into postgres. import.py interacts directly with postgres, not graphQL, so postgres must be exposed on a port to the host where import.py is run, or import.py must be run inside the docker-compose network. Each invocation of import.py will have a unique import_id field in postgres, so it should be easy to track or revert runs of the import script.

### Example config.json

```json
{
    "filename": "boston2017_19.csv",
    "has_lat_long": false,
    "dataset_name": "Boston 2017-2019",
    "cost_col": 6,
    "sq_ft_col": 13,
    "street_number_col": 18,
    "street_col": 19,
    "city_col": 22,
    "state_col": 23,
    "zip_col": 25
}
```