const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProvinceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    
    districts: [{
        type: Schema.Types.ObjectId,
        ref: 'District'
    }],
    
    created_at: {
        type: Date,
        default: Date.now
    },

});


module.exports = mongoose.model('Province', ProvinceSchema);