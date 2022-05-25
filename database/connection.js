const mongoose = require("mongoose");
require("dotenv").config();

// connect to a mongodb database
const connectDB = async () => {
	const uri = process.env.MONGO_URI;
	try {
		mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log("MongoDB Connected...");
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
