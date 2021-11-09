const Country = require('../models/Country');
const Province = require('../models/Province');
const HealthZone = require('../models/HealthZone');
const HealthArea = require('../models/HealthArea');
const Village = require('../models/Village');

new Country({
    name: "Test Country"
}).save();

const parseTreatmentCycles = (req) => {
    var result = {};

    for (const [key, value] of Object.entries(req)) {
        result[key] = value;
    }

    return result;
}

console.log(parseTreatmentCycles({
    "key": 2,
    "key2": "sun"
}));

