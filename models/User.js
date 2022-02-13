const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: { // 0: nurse, 1: manager, 2: accessor (with access code) 
        type: String,
        default: 'normal'
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('User', UserSchema);

