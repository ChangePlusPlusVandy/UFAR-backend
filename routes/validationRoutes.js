const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const validationRouter = express.Router();

/**
 * @api {post} /validation/<health_zone_id>/reports/validate validate list of reports from a health zone
 */
validationRouter.post('/:health_zone_id/reports/validate', (req, res) => {

    console.log("Validating Health Zone reports endpoint reached, and received following data: ");
    console.log(req.body);

    // calls helper function
    functions.validateHealthZoneReports(req.body).then(data => {
        if (data.error != null) {
            console.log("Error occurred when updating Health Zone reports: " + data.error);
            res.status(500).send({
                message: data.error.message || "Some error occurred when validating/updating health zone reports."
            });
        } else {
            console.log("Validated/updated " + req.body.length + " health zone reports: ");
            console.log(data.result);
            res.status(200).send(data.result);
        }
    });

});

/**
 * @api {post} /validation/<health_zone_id>/reports
 */
 validationRouter.get('/:health_zone_id/reports', (req, res) => {

    var health_zone_id = req.params.health_zone_id;
    // good test 1 - 618b21eb8453970bd916764c

    console.log("Health zone id received: " + health_zone_id);

    // call helper function
    functions.getForms(health_zone_id, "unvalidated", (err, result) => {
        if (err == null) {
            console.log("Found and returned " + result?.length + " forms");
            res.status(200).send(result);
        } else {
            console.log("Error getting forms for health zone: " + err);
            res.status(500).send({ 
                message: err.message || "Some error occurred while receiving forms."
            });
        }
    });
});


module.exports = validationRouter;