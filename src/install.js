var json = require("../package.json"); // Package json as a json object
var dependencies = json.dependencies; // Dependencies as a json object
var count = 1 + Object.keys(dependencies).length; // Number of dependencies
console.log(count + " dependencies installed.");
