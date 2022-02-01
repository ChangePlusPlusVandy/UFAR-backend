const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const formRouter = express.Router();

/**
 * @api {post} /form/insert insert a form
 */
formRouter.post('/insert', (req, res) => {

    // call helper function
    functions.addReport(req, (result, err) => {
        if (err == null) {
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


module.exports = formRouter;
