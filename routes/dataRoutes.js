const express = require('express');
const mongoose = require('mongoose');
const dataRouter = express.Router();

const functions = require('../database/functions');

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
 * @api {post} /data/<health_zone_id>/drugs - provide drug proportion data for drug dashboard
 */
 dataRouter.post('/:health_zone_id/drugs', (req, res) => {
    let health_zone_id = mongoose.Types.ObjectId(req.params.health_zone_id);
    console.log("Received request for drug proportion data from health zone with id: " + health_zone_id);

    // call helper function
    functions.getDrugData(health_zone_id, 31).then(data => {
        if (data.error != null) {
            console.log("Error getting drug data for health zone: " + data.error);
            res.status(500).send({
                message: data.error.message || "Some error occurred while getting the drug data."
            });
        } else {
            console.log("Found and returned drug data from " + Object.keys(data.result).length + " health areas");
            console.log(data.result);
            res.status(200).send(data.result);
        }
    });
});

module.exports = dataRouter;
