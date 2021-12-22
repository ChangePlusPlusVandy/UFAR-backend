Report = require('../models/Report');
const Province = require('../models/Province');
const Report = require('../models/Report');

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

    var formDoc = new Report(req.body);
      
    console.log("New report: " + formDoc);

    //todo come bck to this
    formDoc.save().then(result => {
        callback(result, null);
    }).catch(err => {
        console.log("Error saving form: " + err.message);
        callback(null, err);
    });
}

const validateReport = function(reportId, callback) {
    Report.findByIdAndUpdate({reportId}, {"is_validated": true}, (err, result) => {
        if (err != null) {
            console.log("Error validating form " + reportId + ": " + err.message);
            callback(null, err);
        } else {
            callback(result, null);
        }
    });
}

const validateHealthZoneReports = function(req, callback) {
    let success = true;

    for (let reportId in req.body) {
        validateReport(reportId, (err, result) => {
            if (err != null) {
                callback(null, err);
                success = false;
            }
        });
    }
    
    if (success) {
        callback(result, null);
    }
}

module.exports = { addReport, getLocationData, validateHealthZoneReports };