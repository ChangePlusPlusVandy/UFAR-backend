#
# !!DANGER!! - this will delete all current village/health zone/etc data and reload from an xl file.
#
# -> use with caution
#
import time

from pymongo import MongoClient
import pandas as pd
import os
from dotenv import load_dotenv

PROVINCE_KEY = "province"
HEALTH_ZONE_KEY = "Zone_de_sante"
HEALTH_AREA_KEY = "Aire_de_sante"
VILLAGE_KEY = "village"

# Open spreadsheet
workbook = pd.read_excel('villages.xlsx')

# Load env variable with mongo string
load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')

# Establish mongo connection
client = MongoClient(MONGO_URI)
db = client["ufar"]

# Health Areas
villages = db["Village"]
health_areas = db["HealthArea"]
health_zones = db["HealthZone"]
provinces = db["Province"]

# Wipe Current Data
provinces.delete_many({})
health_zones.delete_many({})
health_areas.delete_many({})
villages.delete_many({})

last_province_id = ""
last_province = ""

last_health_zone_id = ""
last_health_zone = ""

last_health_area_id = ""
last_health_area = ""

addedVills = 0

# Iterate through rows of spreadsheet
totalCount = workbook[workbook.columns[0]].count()

start_time = time.time()

for index, row in workbook.iterrows():
    prog = " [" + ((int)(15 * addedVills / totalCount) * "#") + ((int)(15 * (1 - addedVills / totalCount)) * "_") + "]"
    print("Processed " + str(addedVills) + "/" + str(totalCount) + prog)
    time_diff = (time.time() - start_time) / 60
    final_time = (int) ((totalCount * time_diff / (addedVills + 1)) - time_diff)
    print("-> " + str(final_time) + " min remains")

    # If it is a new province, we create it in db
    if (row[PROVINCE_KEY] != last_province):
        last_province_id = provinces.insert_one({"name": row[PROVINCE_KEY]}).inserted_id
        last_province = row[PROVINCE_KEY]

    # If it is a new health zone, we create it in db and add its id to province
    if (row[HEALTH_ZONE_KEY] != last_health_zone):
        last_health_zone_id = health_zones.insert_one({"name": row[HEALTH_ZONE_KEY]}).inserted_id
        provinces.update_one({"_id": last_province_id}, {"$addToSet": {"health_zones": last_health_zone_id}})
        last_health_zone = row[HEALTH_ZONE_KEY]

    # If it is a new health area, we create it in db and add its id to health area
    if (row[HEALTH_AREA_KEY] != last_health_area):
        last_health_area_id = health_areas.insert_one({"name": row[HEALTH_AREA_KEY]}).inserted_id
        health_zones.update_one({"_id": last_health_zone_id}, {"$addToSet": {"health_areas": last_health_area_id}})
        last_health_area = row[HEALTH_AREA_KEY]

    # Village is always new
    last_village_id = villages.insert_one({"name": row[VILLAGE_KEY]}).inserted_id
    # Add newly created village to health area
    health_areas.update_one({"_id": last_health_area_id}, {"$addToSet": {"villages": last_village_id}})

    addedVills = addedVills + 1

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
