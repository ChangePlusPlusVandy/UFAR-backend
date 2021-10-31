const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const PatientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    drug: { // todo: we might need to modify this depending on how therapeutic coverage looks
        type: String,
    },
    disability: { // todo: may need more than string
        type: String,
        required: true
    },
    date: { // creation date?
        type: Date,
        default: Date.now
    },

    validation_status: { // todo: this may need to be object with data about who validated, when, etc
        type: Boolean,
        default: false
    },

    nurse: { // do patients ever have multiple nurses?
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Patient', PatientSchema);
