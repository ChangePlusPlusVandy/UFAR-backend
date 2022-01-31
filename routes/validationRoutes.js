const express = require('express');
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

module.exports = validationRouter;