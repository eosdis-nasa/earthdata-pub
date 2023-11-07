# CSV to JSON

This script simply converts CSV to JSON.

The Earthdata Pub Info provides their input as an Excel Spreadsheet. To get a CSV from Excel, just save the a single sheet as a `.csv` file.

This script is not a direct input for the database. It may help in json formatting, but there is still much manual work to get it into the database. We need to consider how to allow edits to questions in the future. A first pass may be to just expose the json object to a small number of users.

The `.csv` file is the input to the script. The output is a desired `.json` filename. For example:

``` bash
python3 csv_to_json.py example.csv example.json
```