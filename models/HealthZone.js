const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HealthZoneSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    health_areas: [{
        type: Schema.Types.ObjectId,
        ref: 'HealthArea'
    }],
    
    created_at: {
        type: Date,
        default: Date.now
    },

    is_verified: { 
        type: Boolean,
        default: false
    },
});


module.exports = mongoose.model('HealthZone', HealthZoneSchema, 'HealthZone');