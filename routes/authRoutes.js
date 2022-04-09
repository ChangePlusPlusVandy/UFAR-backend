const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Register = require('../models/RegistrationToken');
const authRouter = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const uuid = require("uuid");

/**
 * @api {post} /auth/register register a user
 */
authRouter.post('/register', async function(req, res) {
    console.log('Test');
    console.log(req.body);

    // Check if user already exists
    var existingUser = await User.findOne({name: req.body.name});

    const token = await Register.findOne({ 'token': req.body.uuid, used: false, expiration: {"$gte": new Date()} });

    if (token == null) {
        res.status(500).send({
            message: "Please provide a valid token."
        });
        return;
    } else if (existingUser != null) {
        res.status(500).send({
            message: "User already exists."
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
        role: token.role,
        health_zone: token.health_zone
    });

    user.save().then(result => {
        res.status(201).send("User created successfully: " + result);

        token.used = true;
        token.save();
        // todo: probably need to delete token from db after it's been used
        // delete token from db
        // token.deleteOne();
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
                "role": user.role,
                "health_zone": user.health_zone,
                "_id": user._id
            }
        },
        process.env.JWT_SECRET,
        {
            "algorithm": "HS256",
            "subject": user.name,
            "expiresIn": "7d",
        }
    )
    console.log("token", token);
    res.status(200).send(token);
});

/**
 * @api {post} /auth/newuuid generates a new RegistrationToken instance
 */
 authRouter.post('/newuuid', async function(req, res) {

    if (!req.user && req.user.user.role != 'Admin') {
        res.status(404).send({
            message: "User doesn't have required privileges/not authorized."
        });
        return;
    }

    let expirationDate = new Date();
    expirationDate.setHours( expirationDate.getHours() + 2 );

    const newUUIDToken = new Register({
        token: uuid.v4(),
        expiration: expirationDate,
        role: req.body.role,
        used: false,
        health_zone: mongoose.Types.ObjectId(req.body.health_zone)
    })

    newUUIDToken.save().then(result => {
        console.log("Successfully generated a new UUID token: \n" + result);
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the new UUID token."
        });
    });
});

/**
 * @api {post} /auth/updatepassword - update a user's password
 */
 authRouter.post('/update_password', async function(req, res) {

    if (!req.user) {
        res.status(401).send({
        message: "User doesn't have required privileges/not authorized."});
        return;
    }

    // req format
    /*
    {
        user: "username of user" // only if the admin is sending request
        password: "new password"

    }

    user:
    { 
        name:
        role: 
    }

    */

    var username = req.user.user.name; // if a normal user is sending request, this will be the username
    
    if (req.user.user.role.toLowerCase() == 'admin') {
        username = req.body.username; // if admin is sending request, use the username provided
    }

    if (req.body.password == null) {
        res.status(500).send({
            message: "Please provide a new password."
        });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    const hash = await bcrypt.hash(req.body.password, salt);

    // https://www.npmjs.com/package/bcrypt
    // to check pw, bcrypt.compareSync(myPlaintextPassword, hash); // true

    await User.updateOne({ name: username }, { $set: { password: hash } }).catch(
        error => {
            console.log(error);
            res.status(500).send({
                message: err.message || "Some error occurred while updating the User."
            });
        }
    );
    
    res.status(201).send("User updated successfully.");
});

module.exports = authRouter;