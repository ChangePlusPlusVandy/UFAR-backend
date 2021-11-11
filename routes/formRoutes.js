const express = require('express');
const mongoose = require('mongoose');
const addReport = require('../database/functions');
const router = express.Router();

// TODO - Not much experience with endpoint stuff, not yet sure how authentication
// will work. For now I'll just not worry about authentication

/**
 * @api {post} /form/insert insert a form
 */
 router.post('/insert', (req, res) => {
     
    console.log("Register endpoint reached");
    console.log(req.body);
    
    addReport(req, res);

    res.status(200).send({message: "Form inserted"});
});

module.exports = router;