const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// for scalability, if we for some reason end up with a lot of countries
const CountrySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    provinces: [{
        type: Schema.Types.ObjectId,
        ref: 'Province'
    }]
});
