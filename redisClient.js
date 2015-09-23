

var express = require('express');

var redis = require("redis");
var client = redis.createClient();

client.select(0, function() {});
client.on("error", function(err) {
    console.log("Error " + err);
});

module.exports = client;