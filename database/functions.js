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

    if ('province' in rawBody) {
        if (rawBody.province instanceof String) {
            // We must replace it with mongo object id type
            rawBody.province = mongoose.Types.ObjectId(rawBody.province);
        }
    }

    if ('health_zone' in rawBody) {
        if (rawBody.health_zone instanceof String) {
            // We must replace it with mongo object id type
            rawBody.health_zone = mongoose.Types.ObjectId(rawBody.health_zone);
        }
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

    if ('village' in rawBody) {
        if (rawBody.village instanceof String) {
            // We must replace it with mongo object id type
            rawBody.village = mongoose.Types.ObjectId(rawBody.village);
        }
    }

    var formDoc = new Report(req.body);
      
    console.log("New report created");

    //todo come bck to this
    formDoc.save().then(result => {
        callback(result, null);
    }).catch(err => {
        console.log("Error saving form: " + err.message);
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
    HealthZone.findOne({'_id': health_zone_id}).exec((err, result) => {

        if (err == null) {
            if (!result) {
                callback({
                    message: "Could not find health zone with id " + health_zone_id
                }, {});
                return;
            }

            var findParams = {
                "health_zone": result._id
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

// helper function for the drug data dashboard
const getDrugData = async function(health_zone_id, numPastDays) { 
    try {
        // drugData object will hold the drug data
        const drugData = {};

        // find health zone whose id is health_zone_id
        const healthZone = await HealthZone.find({"_id": health_zone_id}).populate({
            path: "health_areas"
        }).exec();

        // health zone with health_zone_id as its id does not exist
        if (healthZone.length == 0) {
            console.log("Could not find health zone with id " + health_zone_id);
            return {result: drugData, error: null};
        }

        // calculate the earliest date from which to get data from
        const earliestDate = new Date();
        earliestDate.setDate(earliestDate.getDate() - numPastDays);

        // iterate through every health area in the health zone
        for (h in healthZone[0]["health_areas"]) {
            let healthArea = healthZone[0]["health_areas"][h];

            // find all reports that are for all the villages in the health area, are validated, and are from the past specified dates
            // console.log("date: " + earliestDate);
            // every report instance has a health_area property. We implemented to the rendundancy to reducy queries to the database
            const reports = await Report.find({ health_area: healthArea, is_validated: true, 'date': {'$gte': new Date(earliestDate)} });
            if (reports.length != 0) {
                // these arrays hold the data about the drugs in the Drug Management section of a report
                const drugsName = ["ivermectin", "albendazole", "praziquantel"];
                const drugsUsed = [];
                const drugsReceived = [];
                
                for (let i = 0; i < drugsName.length; i++) {
                    drugsUsed.push(0);
                    drugsReceived.push(0);
                }

                // get the drug data needed from each valid report
                for (r in reports) {
                    report = reports[r];
                    for (let i = 0; i < drugsName.length; i++) {
                        let drug_management = drugsName[i] + "_management";
                        drugsUsed[i] += report[drug_management]["quantityUsed"];
                        drugsReceived[i] += report[drug_management]["quantityReceived"];
                    }
                }


                // calculate the drug percentages/proportions used for each drug for a health area, and update drugData object
                drugData[healthArea.name] = {};
                for (let i = 0; i < drugsName.length; i++) {
                    let drugPercentage = Math.round(drugsUsed[i] / (drugsReceived[i]||1) * 100);
                    console.log(drugPercentage);
                    drugData[healthArea.name][drugsName[i]] = drugPercentage;
                }
            }
        }
        
        // returns the drug percentages for each drug and for each health area for the health zone with health_zone_id as its id
        return {result: drugData, error: null};

    } catch(err) {
        // catch and return error, if any
        return {result: null, error: err};
    }
}

const getTherapeuticCoverage = async function(health_zone_id, time, callback) {

    var reports

    try {
        const current = new Date();
        const prior = current.setDate(current.getDate() - time);

        reports = await Report.find( {'health_zone': health_zone_id, is_validated: true, 'MDD_start_date': {'$gte': new Date(prior) } } ).exec();
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
        var health_area_id = rep['health_area'];
        var health_area = (await HealthArea.findOne({'_id': health_area_id}).exec()).name;
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

        console.log("area", area);
        console.log("value", value);

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


        finalResults["mectizan"][area] += value["mectizan"] / (value["enumerated_persons"] || 1) * 100 // avoid division by zero
        finalResults["mectizan_and_albendazole"][area] += value["mectizan_and_albendazole"] / (value["enumerated_persons"] || 1) * 100
        finalResults["albendazole"][area] += value["albendazole"] / (value["enumerated_persons"] || 1) * 100
        finalResults["praziquantel"][area] += value["praziquantel"] / (value["enumerated_persons"] || 1) * 100
    }

    callback(finalResults, null);
}

const getGeographicalCoverage = async function(health_zone_id, time, callback) {

    var reports

    try {
        const current = new Date();
        const prior = current.setDate(current.getDate() - time);

        console.log(new Date(prior))

        reports = await Report.find( {'health_zone': health_zone_id, is_validated: true, 'MDD_start_date': {'$gte': new Date(prior) } }).exec();

        console.log("Waiting for report " + reports.length);
    } catch(err) {
        callback(null, "Error getting villages from health zone: " + err);
    }
 
    /*
    will store in form 
 
    <healtharea>:
        <treated_villages>: []
        <untreated_villages>: []
    */
    const results = {}

    for (rep of reports) {

        var health_area_id = rep['health_area'];
        // get health_area using health_area_id
        var health_area = (await HealthArea.findById(health_area_id).exec()).name;
        var village = rep['village'];

        var treated = rep['onchocerciasis']["first_round"] > 0 ||
                    rep['onchocerciasis']["second_round"] > 0 ||
                    rep['lymphatic_filariasis']["mectizan_and_albendazole"] > 0 ||
                    rep['lymphatic_filariasis']["albendazole_alone"]["first_round"] > 0 ||
                    rep['lymphatic_filariasis']["albendazole_alone"]["second_round"] > 0 ||
                    rep['schistosomiasis'] > 0 ||
                    rep['soil_transmitted_helminthiasis'] > 0 ||
                    rep['trachoma'] > 0;

        console.log("Report found with vill " + village + " and treated status " + treated);

        if (!(health_area in results)) {
            results[health_area] = {
                "treated_villages": [],
                "untreated_villages": []
            }
        }

        if (village in results[health_area]["treated_villages"]) continue;
        if (treated) {
            results[health_area]["treated_villages"].push(village);

            // remove from untreated
            const index = results[health_area]["untreated_villages"].indexOf(village)
            if (index > -1) results.splice(index, 1); // remove from untreated
        } else {
            if (!(village in results[health_area]["untreated_villages"])) {
                results[health_area]["untreated_villages"].push(village);
            }
        }
    }

    const finalResults = {}

    // go through each health area and compute percent treated
    for (const [area, value] of Object.entries(results)) {
        finalResults[area] = value['treated_villages'].length / (value['treated_villages'].length + value['untreated_villages'].length) * 100
    }

    callback(finalResults, null);
}

module.exports = { addReport, getLocationData, getForms, formatLocationData, getDrugData, getTherapeuticCoverage, getGeographicalCoverage };
