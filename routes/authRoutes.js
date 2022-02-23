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

    res.status(200).send(token);
});

/**
 * @api {post} /auth/newuuid generates a new RegistrationToken instance
 */
 authRouter.post('/newuuid', async function(req, res) {
    console.log(req.body);

    let authorized = true;

    const user = await User.findOne({'name': req.body.name});
    console.log(user);
    if (user == null) {
        authorized = false;
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        authorized = false;
    }

    if (req.body.role != 'Admin') {
        authorized = false;
    }

    if (!authorized) {
        res.status(404).send({
            message: "User doesn't have required privileges/not authorized."
        });
        return;
    }

    var expirationDate = new Date();
    expirationDate.setHours( expirationDate.getHours() + 2 );

    const newUUIDToken = new Register({
        token: req.body.uuid,
        expiration: expirationDate,
        role: user.role,
        used: true
    });

    res.status(200).send(newUUIDToken);
});

/**
 * @api {post} /auth/updatepassword - update a user's password
 */
 authRouter.post('/update_password', async function(req, res) {

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

    var isAdmin = req.body.user.role == 'admin'; 
    var user = req.body.user.name; 
    
    if (isAdmin) {
        user = req.body.user;
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

    await UserModel.updateOne({ name: user }, { $set: { password: hash } }).catch(
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