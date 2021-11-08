const mongoose = require('mongoose');
const { schema } = require('./User');
const Schema = mongoose.Schema;

const DrugSchema = new Schema({

    report: {
        type: Schema.Types.ObjectId,
        ref: 'Report',
        required: true
    },

    date: {
        type: Date,
        default: Date.now
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


    