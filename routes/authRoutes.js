const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Register = require('../models/RegistrationToken');
const authRouter = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @api {post} /auth/register register a user
 */
authRouter.post('/register', async function(req, res) {
    console.log('Test');
    console.log(req.body);

    const token = await Register.findOne({ 'token': req.body.uuid, used: false, expiration: {"$gte": new Date()} });

    if (token == null) {
        res.status(500).send({
            message: "Please provide a valid token."
        });
        return;
    }

    console.log("Found valid token " + token);

    const hash = bcrypt.hashSync(req.body.password, saltRounds);

    // https://www.npmjs.com/package/bcrypt
    // to check pw, bcrypt.compareSync(myPlaintextPassword, hash); // true

    const user = new User({
        name: req.body.name,
        password: hash,
        role: token.role
    });

    user.save().then(result => {
        res.status(201).send("User created successfully: " + result);

        token.used = true;
        token.save();
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
});

module.exports = authRouter;