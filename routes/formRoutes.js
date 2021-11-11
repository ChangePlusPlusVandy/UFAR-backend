const express = require('express');
const mongoose = require('mongoose');
const addReport = require('../database/functions');
const formRouter = express.Router();

/**
 * @api {post} /form/insert insert a formt
 */
formRouter.post('/insert', (req, res) => {

    console.log("register endpoint reached");
    console.log(req.body);

    // call helper function
    addReport(req, res);

    res.status(200).send({ 
        message: "Form inserted"
    });
});




module.exports = formRouter;