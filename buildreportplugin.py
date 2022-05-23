# This file reads the sample report and generates headers for excel spreadsheet based on it
import json

# Opening JSON file
f = open('database/samplereport.json')

# returns JSON object as
# a dictionary
data = json.load(f)

# Iterating through the json
# list
for i in data:
    print(i)

# Closing file
f.close()