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
const addReport = function(req, callback) {
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
    }

    if ('village' in rawBody) {
        if (rawBody.village instanceof String) {
            // We must replace it with mongo object id type
            rawBody.village = mongoose.Types.ObjectId(rawBody.village);
        }
    }

    var formDoc = new Report(req.body);
      
    console.log("New report: " + formDoc);

    //todo come bck to this
    formDoc.save().then(result => {
        callback(null, result);
    }).catch(err => {
        console.log("Error saving form: " + err.message);
        callback(err, null);
    });
}

const validateHealthZoneReports = async function(reports) {

    try {
        
        const updatedReports = [];

        for (const report of reports) {
            const id = mongoose.Types.ObjectId(report._id);
            delete report._id;

            const updatedReport = await Report.findByIdAndUpdate(id, {...report}, {new: true});

            updatedReports.push(updatedReport);
        }

        return {result: updatedReports, error: null};

    } catch (err) {

        return {result: null, error: err};

    }
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
            if (result.length == 0) {
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

module.exports = { addReport, getLocationData, getForms, formatLocationData, validateHealthZoneReports };