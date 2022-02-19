const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Register = require('../models/RegistrationToken');
const authRouter = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

    //const hash = bcrypt.hashSync(req.body.password, saltRounds);

    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const hash = await bcrypt.hash(req.body.password, salt);

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

/**
 * @api {post} /auth/login logs in a user
 */
 authRouter.post('/login', async function(req, res) {
    console.log(req.body);

    const user = await User.findOne({'name': req.body.name});
    console.log(user);

    if (user == null) {
        res.status(404).send({
            message: "User not found."
        });
        return;
    }

    console.log(user.password);
    console.log(req.body.password);
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        res.status(404).send({
            message: "Invalid password."
        });
        return;
    }

    const token = jwt.sign(
        { 
            "user": {
                "name": user.name,
                "role": user.role
            }
        },
        process.env.JWT_SECRET,
        {
            "algorithm": "HS256",
            "subject": user.name,
            "expiresIn": "7d",
        }
    )

    res.status(201).send(token);
});

module.exports = authRouter;