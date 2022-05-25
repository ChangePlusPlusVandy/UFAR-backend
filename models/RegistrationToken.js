const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegistrationTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  expiration: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: "Normal"
  },
  used: {
    type: Boolean,
    default: false
  },
  health_zone: {
    type: Schema.Types.ObjectId,
    ref: "HealthZone"
  }
});

module.exports = mongoose.model("Registration", RegistrationTokenSchema, "Registration");
