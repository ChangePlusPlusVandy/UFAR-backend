const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const dataRouter = express.Router();

const { formatLocationData } = require('../database/functions');

/**
 * @api {post} /data/locations - get the full location list
 */
dataRouter.get('/locations', (req, res) => {

    // verify user
    if (!req.user) {
        res.status(401).send("Unauthorized user error");
        return;
    }

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

    // verify user
    if (!req.user) {
        res.status(401).send("Unauthorized user error");
        return;
    }

    var health_zone_id = req.params.health_zone_id;
    // todo: return error if health_zone_id is invalid or not provided
    // good test 1 - 618b21eb8453970bd916764c
    // http://localhost:3000/data/618b21eb8453970bd916764c/therapeutic_coverage

    // call helper function
    functions.getTherapeuticCoverage(health_zone_id, req.body.startDate, req.body.endDate, (result, err) => {
        // todo: ask stake holders (if dmm day or monthly) and integrate into this
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
 * @api {post} /data/health zone id/geographic_coverage - get geographic coverage stats for health zone
 */
 dataRouter.post('/:health_zone_id/geographic_coverage', (req, res) => {

    // verify user
    if (!req.user) {
        res.status(401).send("Unauthorized user error");
        return;
    }

    var health_zone_id = req.params.health_zone_id;
    console.log("Received request for geographic coverage data from health zone with id: " + health_zone_id);
    // good test 1 - 618b21eb8453970bd916764c
    // ex village 618b21ec8453970bd9167653
    // http://localhost:3000/data/618b21eb8453970bd916764c/therapeutic_coverage

    // call helper function
    functions.getGeographicalCoverage(health_zone_id, req.body.startDate, req.body.endDate, (result, err) => {
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

    // verify user
    if (!req.user) {
        res.status(401).send("Unauthorized user error");
        return;
    }

    let health_zone_id = req.params.health_zone_id;

    // todo: return error if health_zone_id is invalid or not provided
    console.log("Received request for drug proportion data from health zone with id: " + health_zone_id);

    // call helper function
    functions.getDrugData(health_zone_id, req.body.startDate, req.body.endDate).then(data => {
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

/**
 * @api {post} /data/download_forms
 */
 dataRouter.post('/download_forms', async (req, res) => {

    // verify user

    console.log("user", req.user);
    console.log("body", req.body);
    
    if (!req.user) {
        res.status(401).send("Unauthorized user error");
        return;
    }

    res.statusCode = 200;
    res.type('text/csv');
    res.setHeader('Content-type', 'text/csv');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Header to force download
    res.setHeader('Content-disposition', 'attachment; filename=Report.csv');

    const params = {
        date: {
            $gte: new Date(req.body.startDate),
            $lte: new Date(req.body.endDate)
        },
        healthZoneId: req.user.user.health_zone.id,
        is_validated: true
    }

    // call helper function to handle request
    functions.getFormsAsCSV(params, res);
});

module.exports = dataRouter;