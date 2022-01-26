const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const dataRouter = express.Router();

const { formatLocationData } = require('../database/functions');

/**
 * @api {post} /data/locations - get the full location list
 */
 dataRouter.get('/locations', (req, res) => {

    // handle w/ helper
    functions.getLocationData((err, result) => {
        console.log("Location result received - " + err);
        if (err != null) {
            res.status(500).send({
                message: err.message || "An error occured fetching location data." 
            });
        } else {
            res.status(200).send({
                "provinces": formatLocationData(result)
            });
        }
    });
});

/**
 * @api {post} /health zone id/therapeutic_coverage - get therapeutic coverage stats for health zone
 */
 dataRouter.post('/:health_zone_id/therapeutic_coverage', (req, res) => {

    var health_zone_id = req.params.health_zone_id;
    // good test 1 - 618b21eb8453970bd916764c
    // http://localhost:3000/data/618b21eb8453970bd916764c/therapeutic_coverage

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

/**
 * @api {post} /health zone id/geographic_coverage - get geographic coverage stats for health zone
 */
 dataRouter.post('/:health_zone_id/geographic_coverage', (req, res) => {

    var health_zone_id = req.params.health_zone_id;
    console.log("Received request for geographic coverage data from health zone with id: " + health_zone_id);
    // good test 1 - 618b21eb8453970bd916764c
    // http://localhost:3000/data/618b21eb8453970bd916764c/therapeutic_coverage

    // call helper function
    functions.getGeographicalCoverage(health_zone_id, 30, (result, err) => {
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
