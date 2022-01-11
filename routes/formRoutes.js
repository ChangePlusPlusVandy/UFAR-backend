const express = require('express');
const mongoose = require('mongoose');
const functions = require('../database/functions');
const formRouter = express.Router();

/**
 * @api {post} /form/insert insert a formt
 */
formRouter.post('/insert', (req, res) => {

    console.log("insert form endpoint reached");
    console.log(req.body);

    // call helper function
    functions.addReport(req, (err, result) => {
        if (err == null) {
            console.log("Saved ");
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
