

var express = require('express');

var redis = require("redis");
var client = redis.createClient(), multi;

//The number stands for the db index
client.select(1, function() {});

client.on("error", function(err) {
    console.log("Error " + err);
});

module.exports = client;