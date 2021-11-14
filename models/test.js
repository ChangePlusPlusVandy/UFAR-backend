const Province = require('./Province.js');
const HealthArea = require('./HealthArea.js');

console.log("eee")

HealthArea.findById("618b21ff8453970bd916772a", function (err, doc) {
    console.log("found")
    if (err) {
        console.log(err);
        return true;
    }

    console.log(doc);
    // prints "The author is Ian Fleming"
});

console.log("ff")