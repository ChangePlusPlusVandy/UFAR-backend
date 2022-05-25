const Country = require("../models/Country");

new Country({
	name: "Test Country"
}).save();

const parseTreatmentCycles = (req) => {
	const result = {};

	for (const [key, value] of Object.entries(req)) {
		result[key] = value;
	}

	return result;
};

console.log(
	parseTreatmentCycles({
		key: 2,
		key2: "sun"
	})
);
