const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const router = express.Router();

/**
 * @api {post} /users/get register a user
 */
 router.get('', (req, res) => {
     console.log("Test endpoint reached");
    User.find({}, function(err, foundUser) {
		res.json(foundUser);
	});
});


module.exports = router;