const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DistrictSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    
    health_zones: [{
        type: Schema.Types.ObjectId,
        ref: 'HealthZone'

    }],

    target_num: { // can be modified by admin
        type: Number,
        default: 0
    },

    current_num: {  // For each health zone, the number of patients in that health zone
        // added together 
        // easy: update everytime a patient is added to a health zone within the district
        type: Number,
        default: 0
    },
    
    created_at: {
        type: Date,
        default: Date.now
    },

    // progress = (current_num / target_num) * 100%
});