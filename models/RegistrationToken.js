const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// for scalability, if we for some reason end up with a lot of countries
const RegistrationTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'Normal'
    },
    used: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Registration', RegistrationTokenSchema, 'Registration');
