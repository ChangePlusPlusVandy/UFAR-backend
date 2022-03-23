const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const formRouter = express.Router();

/**
 * @api {post} /form/insert insert a form
 */
formRouter.post('/insert', (req, res) => {

    // verify user
    if (!req.user) res.status(401).send("Unauthorized user error");

    // call helper function
    functions.addReport(req, (result, err) => {
        if (err == null) {
            console.log(result);
            console.log("Saved " + result.nurse + "'s form");
            res.status(200).send(result);
        } else {
            console.log("Error saving form: " + err);
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Form."
            });
        }
    });
});

/**
 * @api {post} /form/get_unvalidated
 */
 formRouter.get('/get_unvalidated', (req, res) => {

    // verify user
    if (!req.user) res.status(401).send("Unauthorized user error");

    // handle w/ helper

    console.log("S ID " + req.user.user._id);

    functions.getForms(req.user.user.health_zone, "unvalidated", req.user.user._id, (err, result) => {
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


module.exports = formRouter;
