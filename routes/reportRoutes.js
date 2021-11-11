const express = require('express');
const mongoose = require('mongoose');
const Report = require('../models/Report');
const reportRouter = express.Router();

/**
 * @api {post} /report/register register a report
 */
reportRouter.post('/register', (req, res) => {
    console.log(req.body);
    const report = new Report({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    report.save().then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Report."
        });
    });
});




module.exports = reportRouter;