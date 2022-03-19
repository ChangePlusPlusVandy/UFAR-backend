const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const Report = require('../models/Report');
const validationRouter = express.Router();

/**
 * @api {post} /validation/<health_zone_id>/reports/validate validate a report
 */
validationRouter.post('/:health_zone_id/reports/validate', async (req, res) => {
    console.log(req.body);

    try {
        const id = mongoose.Types.ObjectId(req.body._id);
        const validatedReport = await Report.findByIdAndUpdate(id, {is_validated: true}, {new: true});
        res.status(200).send(validatedReport);
    } catch (err) {
        console.log("Error occurred when validating report: " + err.message);
        res.status(500).send({
            message: err.message || "Some error occurred when validating report."
        });
    }
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
