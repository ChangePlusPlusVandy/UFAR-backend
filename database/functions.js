const Province = require('../models/Province');
const HealthArea = require('../models/HealthArea');
const HealthZone = require('../models/HealthZone');
const Village = require('../models/Village');
const Report = require('../models/Report');
const TrainingForm = require('../models/TrainingForm');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

//TODO: Move to own files

// checks if a string is a valid mongodb ObjectId or not
const isValidObjectId = (id) => {
    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id) return true;
        return false;
    } 
    return false
}

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

    rawBody['submitter'] = req.user.user._id; // Store the submitting user

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
        // We must find health area if they didn't provide it
        var hz = await HealthZone.findOne({'health_areas': {'$in': rawBody.health_area}}).exec();
        rawBody.health_zone = hz['_id']
    }

    if ('village' in rawBody) {
        if (rawBody.village instanceof String) {
            // We must replace it with mongo object id type
            rawBody.village = mongoose.Types.ObjectId(rawBody.village);
        }
    }

    // check if rawBody._id is a valid object id
    if (mongoose.Types.ObjectId.isValid(rawBody._id) &&
        (String)(new mongoose.Types.ObjectId(rawBody._id)) === rawBody._id) {
        // We are updating an existing document

        parsedId = rawBody._id;

        if (parsedId instanceof String) {
            parsedId = mongoose.Types.ObjectId(parsedId)
        }

        const result = await Report.findByIdAndUpdate(parsedId, rawBody, {new: true});

        /*
        Report.updateMany({ _id: parsedId }, { $set: { "Changed": true } }).catch(
            error => {
                console.log("Error updating form: " + error.message);
                callback(null, error)
            }
        );*/

        console.log("Form updated ww/ id " + rawBody._id);

        callback(result, null);
    }
    else
    {
        // Create new doc
        var formDoc = new Report(req.body);
    
        //todo come bck to this
        formDoc.save().then(result => {
            console.log("new form inserted");
            callback(result, null);
        }).catch(err => {
            console.log("Error saving form: " + err.message);
            callback(null, err);
        });
    }
}

/**
 * 
 * @param {*} health_zone_id The health zone the forms belong to
 * @param {*} validation_status "validated", "unvalidated", or "" depending on what types of forms are desired
 * @param {*} user The user that created the token. Blank for all users
 * @param {*} callback The callback to send to once the request has been completed (error or not)
 */
const getForms = function(health_zone_id, validation_status, callback, user="") {

    var findParams = {
        health_zone: health_zone_id,
    };

    if (validation_status == "validated") findParams.push({'is_validated': true});
    if (validation_status == "unvalidated") findParams.push({'is_validated': false});
    if (user != "") {
        if (user instanceof String) {
            user = mongoose.Types.ObjectId(user);
        }
        findParams['submitter'] = mongoose.Types.ObjectId(user);
    }

    Report.find(findParams).exec(callback);   
    
}

function flatten(obj) {
    var empty = true;
    if (obj instanceof Array) {
        str = '[';
        empty = true;
        for (var i=0;i<obj.length;i++) {
            empty = false;
            str += flatten(obj[i])+', ';
        }
        return (empty?str:str.slice(0,-2))+']';
    } else if (obj instanceof Object) {
        str = '{';
        empty = true;
        for (i in obj) {
            empty = false;
            str += i+'->'+flatten(obj[i])+', ';
        }
        return (empty?str:str.slice(0,-2))+'}';
    } else {
        return obj; // not an obj, don't stringify me
    }
}

const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const { time } = require('console');

// writeStream = fs.createWriteStream('exports/reports-' + Date.now() + '.csv')
const getFormsAsCSV = async function(findParams = {}, res) {

    // from https://www.bezkoder.com/node-js-export-mongodb-csv-file/

    let converter = require('json-2-csv');

    let reports = []

   
    const customOrderAndDereference = async (report) => {

        return {
            'DMM_day': new Date(report.DMM_day).toLocaleDateString(),
            'province': (await Province.findById(report.province)).name,
            'health_zone': (await HealthZone.findById(report.health_zone)).name,
            'health_area': (await HealthArea.findById(report.health_area)).name,
            'village': (await Village.findById(report.village)).name,
            'date': new Date(report.date).toLocaleDateString(),

            'MDD_start_date': new Date(report.MDD_start_date).toLocaleDateString(),
            'MDD_end_date': new Date(report.MDD_end_date).toLocaleDateString(),
            'distributors': report.distributors,
            'patients': report.patients,
            'households': report.households,
            
            'onchocerciasis': report.onchocerciasis,
            'lymphatic_filariasis': report.lymphatic_filariasis,
            'schistosomiasis': report.schistosomiasis,
            'soil_transmitted_helminthiasis': report.soil_transmitted_helminthiasis,
            'trachoma': report.trachoma,

            'numTreatmentCycles': report.numTreatmentCycles,

            'dcs_training_completion_date': new Date(report.dcs_training_completion_date).toLocaleDateString(),
            'medicines_arrival_date': new Date(report.medicines_arrival_date).toLocaleDateString(),
            'date_of_transmission': new Date(report.date_of_transmission).toLocaleDateString(),

            'blind': report.blind,
            'lymphedema': report.lymphedema,
            'hydroceles': report.hydroceles,
            'trichiasis': report.trichiasis,
            'guinea_worm': report.guinea_worm,

            'ivermectine': report.ivermectine,
            'ivermectine_and_albendazole': report.ivermectine_and_albendazole,
            'albendazole': report.albendazole,
            'praziquantel': report.praziquantel,
            'albendazole_soil_transmitted': report.albendazole_soil_transmitted,
            'side_effects_num': report.side_effects_num,

            'untreated_persons': report.untreated_persons,

            'ivermectin_management': report.ivermectin_management,
            'albendazole_management': report.albendazole_management,
            'praziquantel_management': report.praziquantel_management,
        }
    }

    try {
        await Report.find({...findParams}).exec().then( async (docs) => {
            for (i in docs) {
                var report = await customOrderAndDereference(docs[i]._doc)
                reports.push(report)
            }

            // todo:
            // replace references to health_area, health_zone, and village with their names
            // replace references to submitter with their names
        });

        converter.json2csv(reports, (err, csv) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.status(200).send(csv);
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

// helper function for the drug data dashboard
const getDrugData = async function(health_zone_id, startDate, endDate) { 
    try {
        if (!isValidObjectId(health_zone_id)) {
            return {result: null, error: {message: "Health zone id is not valid."}};
        }

        // drugData object will hold the drug data
        const drugData = {};

        const reports = await Report.find({ health_zone: health_zone_id, is_validated: true, 'date': {'$gte': new Date(startDate), '$lte': new Date(endDate)} });

        if (reports.length != 0) {

            const allHealthAreas = await HealthZone.find({"_id": health_zone_id}).populate({path: "health_areas" }).exec();

            // console.log("health areas:", allHealthAreas[0]["health_areas"]);

            for (ha in allHealthAreas[0]["health_areas"]) {
                const healthArea = allHealthAreas[0]["health_areas"][ha];

                // these arrays hold the data about the drugs in the Drug Management section of a report
                const drugsName = ["ivermectin", "albendazole", "praziquantel"];
                const drugsUsed = [];
                const drugsReceived = [];
                
                for (let i = 0; i < drugsName.length; i++) {
                    drugsUsed.push(0);
                    drugsReceived.push(0);
                }

                // get the drug data needed from each valid report
                inner:
                for (r in reports) {
                    report = reports[r];

                    if (String(report["health_area"]) != String(healthArea._id)) {
                        continue;
                    }

                    console.log("Passed, checking");

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
                    drugData[healthArea.name][drugsName[i]] = drugPercentage;
                }

                // remove a health area if it has no data
                if (drugData[healthArea.name]["albendazole"] == 0 && drugData[healthArea.name]["praziquantel"] == 0 && drugData[healthArea.name]["ivermectin"] == 0) {
                    delete drugData[healthArea.name];
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

const getTherapeuticCoverage = async function(health_zone_id, startDate, endDate, callback) {

    if (!isValidObjectId(health_zone_id)) {
        callback(null, {message: "Health zone id is not valid."});
        return;
    }

    var reports

    try {
        reports = await Report.find( {'health_zone': health_zone_id, is_validated: true, 'date': {'$gte': new Date(startDate), '$lte': new Date(endDate)} } ).exec();
    } catch(err) {
        callback(null, "Error getting villages from health zone: " + err);
        return;
    }
 
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
        
        var enumerated_children = 
                    patients['men']['fiveToFourteen'] + 
                    patients['women']['fiveToFourteen'];

        var ivermectine = rep['ivermectine']['men']['fiveToFourteen'] + rep['ivermectine']['men']['fifteenAndOver'] +
                       rep['ivermectine']['women']['fiveToFourteen'] + rep['ivermectine']['women']['fifteenAndOver']

        var ivermectine_and_albendazole = rep['ivermectine_and_albendazole']['men']['fiveToFourteen'] +
                                        rep['ivermectine_and_albendazole']['men']['fifteenAndOver'] +
                                        rep['ivermectine_and_albendazole']['women']['fiveToFourteen'] +
                                        rep['ivermectine_and_albendazole']['women']['fifteenAndOver']

        var albendazole = rep['albendazole']['men']['fiveToFourteen'] +
                        rep['albendazole']['women']['fiveToFourteen']

        var praziquantel = rep['praziquantel']['men']['fiveToFourteen'] +
                        rep['praziquantel']['women']['fiveToFourteen'] 

        if (!(health_area in results)) {
            results[health_area] = {
                'enumerated_persons': 0,
                'enumerated_children': 0,
                'ivermectine': 0,
                'ivermectine_and_albendazole': 0,
                'albendazole': 0,
                'praziquantel': 0    
            }
        }

        var toUpdate = results[health_area]
            toUpdate['enumerated_persons'] += enumerated_persons
            toUpdate['enumerated_children'] += enumerated_children
            toUpdate['ivermectine'] += ivermectine
            toUpdate['ivermectine_and_albendazole'] += ivermectine_and_albendazole
            toUpdate['albendazole'] += albendazole
            toUpdate['praziquantel'] += praziquantel
    }

    const finalResults = {
        "ivermectine": {},
        "ivermectine_and_albendazole": {},
        "praziquantel": {},
        "albendazole": {}
    }

    for (const [area, value] of Object.entries(results)) {

        console.log("area", area);
        console.log("value", value);

        if (!(area in finalResults["ivermectine"])) {
            finalResults["ivermectine"][area] = 0
        }
        if (!(area in finalResults["ivermectine_and_albendazole"])) {
            finalResults["ivermectine_and_albendazole"][area] = 0
        }
        if (!(area in finalResults["praziquantel"])) {
            finalResults["praziquantel"][area] = 0
        }
        if (!(area in finalResults["albendazole"])) {
            finalResults["albendazole"][area] = 0
        }

        // round all to 1 decimal place
        finalResults["ivermectine"][area] += Math.round(value["ivermectine"] / (value["enumerated_persons"] || 1) * 100 * 10) / 10 // avoid division by zero
        finalResults["ivermectine_and_albendazole"][area] += Math.round(value["ivermectine_and_albendazole"] / (value["enumerated_persons"] || 1) * 100 * 10)/10
        finalResults["albendazole"][area] += Math.round(value["albendazole"] / (value["enumerated_children"] || 1) * 100 * 10)/10
        finalResults["praziquantel"][area] += Math.round(value["praziquantel"] / (value["enumerated_children"] || 1) * 100 * 10)/10
    }

    callback(finalResults, null);
    return;
}

const getGeographicalCoverage = async function(health_zone_id, startDate, endDate, callback) {

    if (!isValidObjectId(health_zone_id)) {
        callback(null, {message: "Health zone id is not valid."});
        return;
    }

    var reports

    try {
        reports = await Report.find( {'health_zone': health_zone_id, is_validated: true, 'date': {'$gte': new Date(startDate), '$lte': new Date(endDate)} }).exec();
        console.log("Waiting for report " + reports.length);
    } catch(err) {
        callback(null, "Error getting villages from health zone: " + err);
        return;
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
                    rep['lymphatic_filariasis']["ivermectine_and_albendazole"] > 0 ||
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
        finalResults[area] = Math.round(value['treated_villages'].length / (value['treated_villages'].length + value['untreated_villages'].length) * 100 * 10) / 10
    }

    callback(finalResults, null);
    return;
}

const addTrainingForm = async function(req) {
        var rawBody = req.body;

        if ('reportingProvince' in rawBody) {
            if (rawBody.reportingProvince instanceof String) {
                rawBody.reportingProvince = mongoose.Types.ObjectId(rawBody.reportingProvince);
            }
        }

        if ('coordinatingProvince' in rawBody) {
            if (rawBody.coordinatingProvince instanceof String) {
                rawBody.coordinatingProvince = mongoose.Types.ObjectId(rawBody.coordinatingProvince);
            }
        }

        var newTrainingForm = new TrainingForm(rawBody);

        return newTrainingForm.save();
}

const editTrainingForm = async function(req) {
    
    try {    
        var rawBody = req.body;

        if (mongoose.Types.ObjectId.isValid(rawBody._id) && (String)(new mongoose.Types.ObjectId(rawBody._id)) === rawBody._id) {

            let parsedId = rawBody._id;

            if (parsedId instanceof String) {
                parsedId = mongoose.Types.ObjectId(parsedId)
            }

            const editedForm = await TrainingForm.findByIdAndUpdate(parsedId, rawBody, {new: true});

            return {result: editedForm, error: null};

        } else {
            return {result: null, error: {message: "Training Form id is not valid."}};
        }
    } catch (err) {
        return {result: null, error: err};
    }
}

module.exports = { addReport, getLocationData, getForms, formatLocationData, getDrugData, getTherapeuticCoverage, getGeographicalCoverage, addTrainingForm, editTrainingForm, getFormsAsCSV };
