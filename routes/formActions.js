const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const router = express.Router();

// TODO - Not much experience with endpoint stuff, not yet sure how authentication
// will work. For now I'll just not worry about authentication

/**
 * @api {post} /form/insert insert a form
 */
 router.post('/insert', (req, res) => {
     
    console.log("Register endpoint reached");
    console.log(req.body);
    
    functions(req, res);

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
});

module.exports = router;