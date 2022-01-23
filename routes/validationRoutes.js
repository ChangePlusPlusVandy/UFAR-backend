const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const validationRouter = express.Router();

/**
 * @api {post} /validation/<health_zone_id>/reports
 */
 validationRouter.post('/:health_zone_id/reports', (req, res) => {

    var health_zone_id = req.params.health_zone_id;
    // good test 1 - 618b21eb8453970bd916764c

    // call helper function
    functions.getForms(health_zone_id, "unvalidated", (err, result) => {
        if (err == null) {
            console.log("Found and returned " + result.length + " forms");
            res.status(200).send({
                "reports": result
            });
        } else {
            console.log("Error getting forms for health zone: " + err);
            res.status(500).send({
                message: err.message || "Some error occurred while receiving forms."
            });
        }
    });
});


module.exports = validationRouter;
