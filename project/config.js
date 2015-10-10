//logging
var log = {
    file: "./logs/all-logs.log",
};

var loggly = {
    token: "5301da7e-cdac-4b4c-b222-980382c5b5ef",
    subdomain: "mytop5",
    tags: ["Winston-NodeJS"],
    json:true
};

var mongo = {
	connectionString: "mongodb://mytop5-node:ghjdthrf@ds063869.mongolab.com:63869/mytop5"
}

exports.log = log;
exports.loggly = loggly;
exports.mongo = mongo;