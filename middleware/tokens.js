
var express = require('express');
var app = express();
var router = express.Router();
var client = require('../redisClient');


// Middleware to all requests
router.use(function(req, res, next) {

    var tokenKey = req.headers.tokenkey;
    var tokenValue = req.headers.tokenvalue;

    if (tokenKey !== undefined && tokenValue !== undefined) {
        
        client.hget("token", tokenKey, function(err, obj) {
            if (obj == tokenValue) {
                next();
            } else {
                res.status(500).json({
                    error: 'Client does not have active token'
                });
            }
        });
    } else {
        res.status(500).json({
            error: 'Token missing'
        });
    }
});

module.exports = router;