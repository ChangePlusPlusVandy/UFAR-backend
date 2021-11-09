Report = require('../models/Report');

//TODO: Move to own files

// this is actually unneeded bc it literally just returns its param copied
const parseTreatmentCycles = (req) => {
    var result = {};

    for (const [key, value] of Object.entries(req)) {
        result[key] = value;
    }

    return result;
}

// https://www.bezkoder.com/mongoose-one-to-many-relationship/

// implement helper functions that query the database
// req should have all the necessary data, res is callback for result
const addReport = function(req, res) {

    /*
    Temp because I keep forgetting...

    Countries have provinces which have districts which have health zones

    Countries -> Provinces -> Districts -> Health Zones
    */

    // General Info

    var dmmDay = req.body.dmmDay; // TODO - should this be an int?
    var nurse = req.body.nurse;

    // We could theoretically just have the request require village name and scan
    // database ourself, but this is much much quicker and frontend should be getting
    // data for all those things so having them in API requests should be easy
    var villageId = req.body.villageId;

    var requiredFields = ["medicines_arrival_date"];

    // Dates
    var date = req.body.date; // TODO: How will default value work? If this is unset will mongo use default val?
    var dcs_training_completion_date = req.body.dcs_training_completion_date;
    var medicines_arrival_date = req.body.medicines_arrival_date;

    // Treatment Circles 
    // problem here - we need to create a report in order to secure an id, which we need 
    // in order to create one-to-many relationships.
    // Generating ids ourself would be possible but likely ill advised
    // Therefore, we must create the report, then add in children

    // 
    var treatmentCircles = req.body.treatmentCircles;

    // a document instance
    /*
    var formDoc = new Report({ 
        name: 'Introduction to Mongoose',
        price: 10,
        quantity: 25
    });
    */

    // hold up - we're dealing with json can't we just do this lmao. 
    var formDoc = new Report(req.body);
      
    console.log("New report: " + formDoc);

    console.log("New report by nurse w/ name: " + formDoc.nurse);
    formDoc.save().then(result => {
        console.log("Saved " + formDoc.nurse);
        res.send(result);
    }).catch(err => {
        console.log("Error saving form: " + err.message);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Form."
        });
    });

    /*
    const pat = new Patient({
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        location: req.body.location,
        validation_status: false,
        disability: "NA"
        // Waiting on drug until storage format more clear. Perhaps an array of objects?
    });
    console.log("New Patient w/ name: " + pat.name);
    pat.save().then(result => {
        console.log("Saved " + pat.name);
        res.send(result);
    }).catch(err => {
        console.log("Error saving patient: " + err.message);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Patient."
        });
    });
    */
}

module.exports = addReport;