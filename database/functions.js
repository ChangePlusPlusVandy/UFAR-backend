const Province = require('../models/Province');
const HealthArea = require('../models/HealthArea');
const HealthZone = require('../models/HealthZone');
const Village = require('../models/Village');
const Report = require('../models/Report');
const mongoose = require('mongoose');

//TODO: Move to own files

// this is actually unneeded bc it literally just returns its param copied
const parseTreatmentCycles = (req) => {
    var result = {};

    for (const [key, value] of Object.entries(req)) {
        result[key] = value;
    }

    return result;
}

const getLocationData = function(callback) {
    Province.find({}).populate({
        path: 'health_zones',
        populate: {
            path: 'health_areas',
            populate: {
                path: 'villages',
                model: 'Village'
            }
        }
    }).exec(callback);   
}


/**
 * formats location data into a new easily searchable format for the front end
 * @param {*} locationData 
 * @returns Object with keys: provinces > health_zones > health_areas > villages
 */
const formatLocationData = function(locationData) {
    var new_structure = {};
    
    locationData.forEach( (province) => {
        new_structure[province.name] = {};
        new_structure[province.name]['id'] = province._id;
        new_structure[province.name]['health_zones'] = {};

        province.health_zones.forEach( (health_zone) => {
            new_structure[province.name]['health_zones'][health_zone.name] = {};
            new_structure[province.name]['health_zones'][health_zone.name]['id'] = health_zone._id;
            new_structure[province.name]['health_zones'][health_zone.name]['health_areas'] = {};

            health_zone.health_areas.forEach( (health_area) => {
                new_structure[province.name]['health_zones'][health_zone.name]['health_areas'][health_area.name] = {};
                new_structure[province.name]['health_zones'][health_zone.name]['health_areas'][health_area.name]['id'] = health_area._id;
                new_structure[province.name]['health_zones'][health_zone.name]['health_areas'][health_area.name]['villages'] = {};
                health_area.villages.forEach( (village) => {
                    new_structure[province.name]['health_zones'][health_zone.name]['health_areas'][health_area.name]['villages'][village.name] = village._id;
                });
            });
        });
    });

    return new_structure;
}

// https://www.bezkoder.com/mongoose-one-to-many-relationship/

// implement helper functions that query the database
// req should have all the necessary data, res is callback for result
const addReport = async function(req, callback) {
    // hold up - we're dealing with json can't we just do this lmao. 

    var rawBody = req.body;

    if (rawBody.village instanceof String) {
        // We must replace it with mongo object id type
        rawBody.village = mongoose.Types.ObjectId(rawBody.village);
    }

    if ('health_area' in rawBody) {
        if (rawBody.health_area instanceof String) {
            // We must replace it with mongo object id type
            rawBody.health_area = mongoose.Types.ObjectId(rawBody.health_area);
        }   
    } else {
        // We must find health area if they didn't provide it
        var ha = await HealthArea.findOne({'villages': {'$in': rawBody.village}}).exec();
        rawBody.health_area = ha['_id']
    }

    if ('health_zone' in rawBody) {
        if (rawBody.health_zone instanceof String) {
            // We must replace it with mongo object id type
            rawBody.health_zone = mongoose.Types.ObjectId(rawBody.health_zone);
        }  
    } else {
        // We must find health zone if they didn't provide it
        var hz = await HealthZone.findOne({'health_areas': {'$in': rawBody.health_area}}).exec();
        rawBody.health_zone = hz['_id']
    }

    var formDoc = new Report(req.body);
      
    console.log("New report created");

    //todo come bck to this
    formDoc.save().then(result => {
        console.log("Successfully saved form.");
        callback(result, null);
    }).catch(err => {
        console.log("Error occurred saving form: " + err.message);
        callback(null, err);
    });
}

/**
 * 
 * @param {*} health_zone_id The health zone the forms belong to
 * @param {*} validation_status "validated", "unvalidated", or "" depending on what types of forms are desired
 * @param {*} callback The callback to send to once the request has been completed (error or not)
 */
const getForms = function(health_zone_id, validation_status, callback) {

    // first we get the healthzone's villages
    HealthZone.find({'_id': health_zone_id}).populate({
        path: 'health_areas',
    //    populate: {               We just need village object id so no need to populate
    //        path: 'villages',
    //        model: 'Village'
    //    }
    }).exec((err, result) => {
        if (err == null) {
            villages = [];

            if (result.length == 0) {
                callback({
                    message: "Could not find health zone with id " + health_zone_id
                }, {});
                return;
            }

            for (ha in result[0]['health_areas']) {
                area = result[0]['health_areas'][ha];
                for (vil in area.villages) {
                    villageId = area.villages[vil];
                    villages.push(mongoose.Types.ObjectId(villageId)); //make it mongo id
                }
            }

            var findParams = {
                village: {"$in": villages}
            };
        
            if (validation_status == "validated") findParams['is_validated'] = true;
            if (validation_status == "unvalidated") findParams['is_validated'] = false;
        
            Report.find(findParams).exec(callback);   
        } else {
            callback("Error getting villages from health zone: " + err, result);
        }
    });   

    /*
    Code if we're storing health zone and health area in report (best search performance):

    var findParams = {
        health_zone: health_zone_id,
    };

    if (validation_status == "validated") findParams.push({'is_validated': true});
    if (validation_status == "unvalidated") findParams.push({'is_validated': false});

    Report.find(findParams).exec(callback);   
    */
}

const getTherapeuticCoverage = async function(health_zone_id, time, callback) {

    var reports

    try {
        const current = new Date();
        const prior = current.setDate(current.getDate() - time);

        reports = await Report.find( {'health_zone': health_zone_id, 'MDD_start_date': {'$gte': new Date(prior) } } ).exec();
    } catch(err) {
        callback(null, "Error getting villages from health zone: " + err);
    }
 
    /*
    will store in form 
 
    <healtharea>:
        <enumerated_persons>:
        <mectizan>:
        <mectizan_and_albendazole>:            This is actually different than just adding them
        <albendazole>:
        <praziquantel>:   


        
    */
    const results = {}

    for (rep of reports) {
        var health_area = rep['health_area'];

        console.log("Viewing report " + rep);

        var patients = rep['patients'];

        var enumerated_persons = 
                    patients['men']['lessThanSixMonths'] + 
                    patients['men']['sixMonthsToFiveYears'] + 
                    patients['men']['fiveToFourteen'] + 
                    patients['men']['fifteenAndAbove'] + 
                    patients['women']['lessThanSixMonths'] + 
                    patients['women']['sixMonthsToFiveYears'] + 
                    patients['women']['fiveToFourteen'] + 
                    patients['women']['fifteenAndAbove'];

        var mectizan = rep['mectizan']['men']['fiveToFourteen'] + rep['mectizan']['men']['fifteenAndOver'] +
                       rep['mectizan']['women']['fiveToFourteen'] + rep['mectizan']['women']['fifteenAndOver']

        var mectizan_and_albendazole = rep['mectizan_and_albendazole']['men']['fiveToFourteen'] +
                                        rep['mectizan_and_albendazole']['men']['fifteenAndOver'] +
                                        rep['mectizan_and_albendazole']['women']['fiveToFourteen'] +
                                        rep['mectizan_and_albendazole']['women']['fifteenAndOver']

        var albendazole = rep['albendazole']['men']['fiveToFourteen'] +
                        rep['albendazole']['men']['fifteenAndOver'] +
                        rep['albendazole']['women']['fiveToFourteen'] +
                        rep['albendazole']['women']['fifteenAndOver']

        var praziquantel = rep['praziquantel']['men']['fiveToFourteen'] +
                        rep['praziquantel']['women']['fiveToFourteen'] 

        if (!(health_area in results)) {
            results[health_area] = {
                'enumerated_persons': 0,
                'mectizan': 0,
                'mectizan_and_albendazole': 0,
                'albendazole': 0,
                'praziquantel': 0    
            }
        }

        var toUpdate = results[health_area]
            toUpdate['enumerated_persons'] += enumerated_persons
            toUpdate['mectizan'] += mectizan
            toUpdate['mectizan_and_albendazole'] += mectizan_and_albendazole
            toUpdate['albendazole'] += albendazole
            toUpdate['praziquantel'] += praziquantel
    }

    const finalResults = {
        "mectizan": {},
        "mectizan_and_albendazole": {},
        "praziquantel": {},
        "albendazole": {}
    }

    for (const [area, value] of Object.entries(results)) {

        if (!(area in finalResults["mectizan"])) {
            finalResults["mectizan"][area] = 0
        }
        if (!(area in finalResults["mectizan_and_albendazole"])) {
            finalResults["mectizan_and_albendazole"][area] = 0
        }
        if (!(area in finalResults["praziquantel"])) {
            finalResults["praziquantel"][area] = 0
        }
        if (!(area in finalResults["albendazole"])) {
            finalResults["albendazole"][area] = 0
        }

        finalResults["mectizan"][area] += value["mectizan"] / value["enumerated_persons"]
        finalResults["mectizan_and_albendazole"][area] += value["mectizan_and_albendazole"] / value["enumerated_persons"]
        finalResults["albendazole"][area] += value["albendazole"] / value["enumerated_persons"]
        finalResults["praziquantel"][area] += value["praziquantel"] / value["enumerated_persons"] 
    }

    console.log("AAA");
    console.log(finalResults);

    callback(finalResults, null);
}

module.exports = { addReport, getLocationData, getForms, formatLocationData, getTherapeuticCoverage };
