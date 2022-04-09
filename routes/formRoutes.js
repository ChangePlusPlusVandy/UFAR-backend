const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const formRouter = express.Router();
const TrainingForm = require('../models/TrainingForm');

/**
 * @api {post} /form/insert insert a form
 */
formRouter.post('/insert', (req, res) => {

    // verify user
    if (!req.user) {
        res.status(401).send("Unauthorized user error");
        return;
    }

    // call helper function
    functions.addReport(req, (result, err) => {
        if (err == null) {
            console.log(result);
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
    // verify user
    if (!req.user) {
        res.status(401).send("Unauthorized user error"); 
        return;
    }

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
 * @api {post} /form/<reportingProvince_id>/getTrainingForm retrieves training forms of a province
 */
 formRouter.get('/:reportingProvince_id/getTrainingForms', (req, res) => {
    // verify user
    if (!req.user) {
        res.status(401).send("Unauthorized user error"); 
        return;
    }

    var reportingProvince_id = mongoose.Types.ObjectId(req.params.reportingProvince_id);

    TrainingForm.find({'reportingProvince': reportingProvince_id}).then(result => {
        console.log("Retrieved " + result.length + " training forms");
        res.status(200).send(result);
    }).catch(err => {
        console.log("Error retrieving training forms: " + err.message);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving training forms."
        });
    });
});

/**
 * @api {post} /form/editTrainingForm edit a training form
 */
 formRouter.post('/editTrainingForm', (req, res) => {

    // verify user
    if (!req.user) {
        res.status(401).send("Unauthorized user error");
        return;
    }

    // call helper function
    functions.editTrainingForm(req).then(data => {
        if (data.error != null) {
            console.log("Error editing training form: " + data.error.message);
            res.status(500).send({
                message: data.error.message || "Some error occurred while editing training form."
            });
        } else {
            console.log("Edited training form with id " + req.body._id);
            res.status(200).send(data.result);
        }
    });
});

/**
 * @api {post} /form/get_unvalidated
 */
 formRouter.get('/get_unvalidated', (req, res) => {

    // verify user
    if (!req.user) {
        res.status(401).send("Unauthorized user error"); 
        return;
    }

    // handle w/ helper

    functions.getForms(req.user.user.health_zone, "unvalidated", (err, result) => {
        if (err == null) {
            console.log("Found and returned " + result?.length + " forms");
            res.status(200).send(result);
        } else {
            console.log("Error getting forms for health zone: " + err);
            res.status(500).send({ 
                message: err.message || "Some error occurred while receiving forms."
            });
        }
    }, req.user.user._id);
});

module.exports = formRouter;
