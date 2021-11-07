const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HealthZoneSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    
    created_at: {
        type: Date,
        default: Date.now
    },

    is_verified: { // it's verified if all patients attached are verified
        type: Boolean,
        default: false
    },
});


module.exports = mongoose.model('HealthZone', HealthZoneSchema);