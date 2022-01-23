const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const dataRouter = express.Router();

/**
 * @api {post} /data/locations - get the full location list
 */
 dataRouter.post('/locations', (req, res) => {

    // handle w/ helper
    functions.getLocationData((err, result) => {
        console.log("Location result received - " + err);
        if (err != null) {
            res.status(500).send({
                message: err.message || "An error occured fetching location data." 
            });
        } else {
            res.status(200).send({
                "provinces": result
            });
        }
    });
});

/**
 * @api {post} /data/locations - get the full location list
 */
 dataRouter.post('/:health_zone_id/therapeutic_coverage', (req, res) => {

    var health_zone_id = req.params.health_zone_id;
    // good test 1 - 618b21eb8453970bd916764c

    // call helper function
    functions.getTherapeuticCoverage(health_zone_id, 30, (result, err) => {
        if (err == null) {
            console.log("Found and returned " + result);
            res.status(200).send(result);
        } else {
            console.log("Error getting forms for health zone: " + err.message + " " + result);
            res.status(500).send({
                message: err.message || "Some error occurred while receiving forms."
            });
        }
    });
});

module.exports = dataRouter;
