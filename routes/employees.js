
var express = require('express');
var router = require('../middleware/tokens');
var client = require('../redisClient');

// on routes that end in /employees
// ----------------------------------------------------
router.route('/')
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
	            res.status(204).json({
	                error: 'Not Found'
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
        	res.status(201).json({
        	    message: 'Object Created'
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

module.exports = router;




