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
                "prrovinces": result
            });
        }
    });
});

module.exports = dataRouter;
