#!/usr/bin/env python3
"""
This script converts a csv file to a json.
"""

import argparse
import csv
import datetime
from dateutil.parser import parse
import json
import logging
import logging.config

logging.config.fileConfig('./logging_config.ini',
                          disable_existing_loggers=False)

LOGGER = logging.getLogger('LOGGER')
LOGGER.debug('Begin import')


def main():
    
    # parse arguments
    args = parse_arguments()
    csvfile = args.input
    jsonfile = args.output

    mapping = map_header()

    # parse input file
    data = parse_csv(csvfile, mapping)

    # convert json
    json_output = convert_to_json(data)

    # output to file
    write_to_file(jsonfile, json_output)


def parse_arguments():
    """get filenames"""
    parser = argparse.ArgumentParser(
        description='input and output files')
    parser.add_argument('input',
                        help='name of csv file for input')
    parser.add_argument('output',
                        help='name of json file to output')
    parser.add_argument('--map', default='mapping.json', help='name of mapping json file')
    args = parser.parse_args()

    return args

def parse_csv(file,mapping):
    """parse csv file"""
    csv_rows = []
    try:
        data = csv.DictReader(open(file, 'r'))
        title = data.fieldnames
        for row in data:
            csv_rows.extend([{mapping.get(title[i]):row[title[i]] for i in range(len(title))}])
    except ValueError as err:
        msg = 'cannot import csv file(s): ' + file + ' (' + err + ')'
        LOGGER.error(msg)
        raise msg

    return csv_rows

def map_header():
    data = json.load(open('mapping.json', 'r'))
    
    return data

def convert_to_json(input_structure):
    """convert input structure to json"""
    try:
        json_output = json.dumps(input_structure, indent=4)
        LOGGER.debug('JSON output created')
    except TypeError as err:
        LOGGER.error('Error creating json_output: %s', err)

    return json_output


def write_to_file(filepath, json_output):
    """write json to file"""
    try:
        with open(filepath, 'w') as file_handle:
            file_handle.write(json_output)
        LOGGER.info('JSON file written: {0}'.format(filepath))
    except IOError as err:
        LOGGER.error('Could not open file ({0}): {1}'.format(filepath, err))


if __name__ == "__main__":
    main()
