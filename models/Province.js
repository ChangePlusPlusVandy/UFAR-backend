const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProvinceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },

  health_zones: [{
    type: Schema.Types.ObjectId,
    ref: 'HealthZone'
  }],

  created_at: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model('Province', ProvinceSchema, 'Province')
