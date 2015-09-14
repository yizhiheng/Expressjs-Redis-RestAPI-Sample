// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// configure body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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
    console.log('Something is happening.');
    next();
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

// on routes that end in /employees
// ----------------------------------------------------
router.route('/employees')
    //create employee
    .post(function(req, res) {
        client.hset("employee", req.query.key, req.query.value, function(err, obj) {
            if (err) {
                res.send(err);
            } else {
                res.send("employee created");
            }
        });
    })

	//get all employees
	.get(function(req, res) {

		var tokenKey = req.headers.tokenkey;
		var tokenValue = req.headers.tokenvalue;

		if (tokenKey !== undefined && tokenValue !== undefined) {

			client.hget("token", tokenKey, function(err, obj) {

				

		    	if (obj == tokenValue) {
		    		client.hgetall("employee", function(err, obj) {
		    		    if (err) {
		    		        res.send(err);
		    		    }
		    		    res.send(obj);
		    		});
		    	} else {
					res.send("client does not have active token");
		    	}
	    	});
		} else {
			res.send("client does not have active token");
		}
	});


router.route('/employees/:key')

	//get employee with key
	.get(function(req, res) {
	    client.hget("employee", req.params.key, function(err, obj) {
	        if (err) {
	            res.send(err);
	        } else {
	            res.json(obj);
	        }
	    });
	})

	// update employee value with key
	.put(function(req, res) {
	    client.hset("employee", req.params.key, req.query.value, function(err, obj) {
	        if (err) {
	            res.send(err);
	        } else {
	            res.send("description updated");
	        }
	    });
	})

	// delete the employee with key
	.delete(function(req, res) {
	    client.hdel("employee", req.params.key, function(err, obj) {
	        if (err) {
	            res.send(err);
	        } else {
	            res.send("employee deleted")
	        }
	        //res.json(obj);
	    });
	});

router.route('/tokens/:key')
	//get employee with key
	.get(function(req, res) {
        //    var tokenBoolean = isTokenActive(req.params.key, "123");
        //   	if (tokenBoolean) {
        //   		console.log("second yes");
        //   		res.send("active");
        //   	} else {
        //   		console.log("second no");
        //   		res.send("non-active");
        //   	}

  		console.log(req.headers);
  		client.hget("token", req.params.key, function(err, obj) {
	    	if (obj == "123") {
	    		res.send("active");
	    	} else {
	    		res.send("non-active");
	    	}
    	});

	})

	.post(function(req, res){
		console.log(req.headers.token);
	});


function isTokenActive(tokenKey, tokenValue) {
    client.hget("token", tokenKey, function(err, obj) {
    	if (obj == tokenValue) {
    		console.log("yes");
    		return true;
    	} else {
    		console.log("no");
    		return false;
    	}
    });
}

function getTokenValue() {

}

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
