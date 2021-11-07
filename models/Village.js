const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VillageSchema = Schema({
    name: {
        type: String,
        required: true,
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    // todo: connecting districts, healthzones, and provinces after tomorrow's meeting.
})


module.exports = mongoose.model("Village", VillageSchema);