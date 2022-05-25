const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HealthAreaSchema = new Schema({
	name: {
		type: String,
		required: true
	},

	villages: [{
		type: Schema.Types.ObjectId,
		ref: "Village"
	}]
});

module.exports = mongoose.model("HealthArea", HealthAreaSchema, "HealthArea");
