const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiseaseSchema = new Schema({
	report: {
		type: Schema.Types.ObjectId,
		ref: "Report",
		required: true
	},

	name: {
		type: String,
		required: true
	},

	number: {
		type: Number,
		default: 0,
		required: true
	}
});

module.exports = mongoose.model("Disease", DiseaseSchema);
