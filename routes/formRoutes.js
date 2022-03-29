const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const formRouter = express.Router();

/**
 * @api {post} /form/insert insert a form
 */
formRouter.post('/insert', (req, res) => {

    // call helper function
    functions.addReport(req, (result, err) => {
        if (err == null) {
            console.log("Saved " + result.nurse + "'s form");
            res.status(200).send(result);
        } else {
            console.log("Error saving form: " + err);
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Form."
            });
        }
    });
});

/**
 * @api {post} /form/insertTrainingForm insert a training form
 */
 formRouter.post('/insertTrainingForm', (req, res) => {

    // call helper function
    functions.addTrainingForm(req).then(result => {
        console.log("Inserted training form");
        res.status(200).send(result);
    }).catch(err => {
        console.log("Error inserting training form: " + err.message);
        res.status(500).send({
            message: err.message || "Some error occurred while inserting training form."
        });
    });
});

/**
 * @api {post} /form/<health_zone_id>/getTrainingForm retrieves training forms of a healthzone
 */
 formRouter.post('/:health_zone_id/getTrainingForm', (req, res) => {

    var health_zone_id = mongoose.Types.ObjectId(req.params.health_zone_id);

    // call helper function
    functions.getTrainingForms(health_zone_id).then(result => {
        console.log("Retrieved " + result.length + " training forms");
        res.status(200).send(result);
    }).catch(err => {
        console.log("Error retrieving training forms: " + err.message);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving training forms."
        });
    });
});

module.exports = formRouter;
