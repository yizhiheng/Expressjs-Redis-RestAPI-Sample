// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var app = express();

// configure body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(logger('dev'));

var port = process.env.PORT || 8080; // set our port


// Redis Connection
// =============================================================================
var redis = require("redis"),
    client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
client.select(0, function() {});

client.on("error", function(err) {
    console.log("Error " + err);
});


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
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


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to our api!'
    });
});

// on routes that end in /employees
// ----------------------------------------------------
router.route('/employees')
    //create employee
    .post(function(req, res) {
        client.hset("employee", req.query.key, req.query.value, function(err, obj) {
            if (err) {
                res.status(500).json({
                    error: err
                });
            } else {
                res.status(400).json({
                    message: 'Object created'
                });
            }
        });
    })

//get all employees
.get(function(req, res) {
    client.hgetall("employee", function(err, obj) {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
        res.send(obj);
    });
});


router.route('/employees/:key')

	//get employee with key
	.get(function(req, res) {
	    client.hget("employee", req.params.key, function(err, obj) {
	        if (err) {
	            res.status(500).json({
	                error: err
	            });
	        } else if (obj == undefined){
	            res.status(500).json({
	                error: 'Cannot find'
	            });
	        }
	        res.send(obj);
	    });
	})

	// update employee value with key
	.put(function(req, res) {
	    client.hset("employee", req.params.key, req.query.value, function(err, obj) {
	        if (err) {
	            res.status(500).json({
	                error: err
	            });
	        }
	        	res.status(200).json({
	        	    message: 'Object created'
	        	});
	    });
	})

	// delete the employee with key
	.delete(function(req, res) {
	    client.hdel("employee", req.params.key, function(err, obj) {
	        if (err) {
	            res.status(500).json({
	                error: err
	            });
	        } else {
	            res.send("Object deleted");
	        }
	    });
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
