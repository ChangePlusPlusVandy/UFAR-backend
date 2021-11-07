const mongoose = require('mongoose');
const { schema } = require('./User');
const Schema = mongoose.Schema;

const DrugSchema = new Schema({

    report: {
        type: Schema.Types.ObjectId,
        ref: 'Report',
        required: true
    },

    name: {
        type: String,
        required: true
    },

    qty_received: {
        type: Number,
        default: 0,
        required: true
    },

    qty_used: {
        type: Number,
        default: 0,
        required : true
    },

    qty_lost: {
        type: Number,
        default: 0,
        required: true
    },

    // create field qty_remaining that is the sum of qty_received - qty_used - qty_lost and calculates
    qty_remaining: {
        type: Number,
        default: 0,
        required: true
    },

    qtr_returned_to_cs: {
        type: Number,
        default: 0,
        required: true
    },

});

module.exports = mongoose.model("Drug", DrugSchema);


    