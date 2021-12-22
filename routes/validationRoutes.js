const express = require('express');
const functions = require('../database/functions');
const validationRouter = express.Router();

/**
 * @api {post} /validation/health_zone/reports/validate validate list of reports from a health zone
 */
validationRouter.post('/health_zone/reports/validate', (req, res) => {
    console.log("Validate forms from Health Zone endpoint reached");
    console.log(req.body);

    // calls helper function
    functions.validateHealthZoneReports(req, (err, result) => {
        if (err == null) {
            console.log("Successfully validated all forms in the given Health Zone.");
            res.status(200).send(result);
        } else {
            res.status(500).send("Some error occurred while validating the forms.");
        }
    });
});

module.exports = validationRouter;