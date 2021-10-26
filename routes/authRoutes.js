const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const authRouter = express.Router();

/**
 * @api {post} /users/register register a user
 */
authRouter.post('/register', (req, res) => {
    console.log(req.body);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
});


module.exports = authRouter;