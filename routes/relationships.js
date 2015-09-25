var express = require('express');
var router = require('../middleware/tokens');
var client = require('../redisClient');

router.route('/')
	.get(function(req, res) {
		res.status(200).json({
		    message: 'Do we need this API?'
		});
	});
	

router.route('/:userId')

	.get(function(req, res) {
		var userId = req.params.userId;
		res.status(200).json({
		    message: 'Do we need this API?'
		});

	})

	//Create a new user, set up three sets to store his relationships data
	.post(function(req, res) {
		var userId = req.params.userId;
		multi = client.multi();
		multi.sadd(userId + "_mutual", "placeholder");
		multi.sadd(userId + "_pending", "placeholder");
		multi.sadd(userId + "_waiting", "placeholder");
		// drains multi queue and runs atomically
		multi.exec(function (err, replies) {
			if (err) {
				res.status(500).json({
		            error: err
		        });
			}
		    res.status(201).json({
		        message: 'Object Created'
		    });
		});

	});


router.route('/:userId/:type')

	.get(function(req, res) {
		var userId = req.params.userId;
		var relationshipType = req.params.type;
		var setName = userId + "_" + relationshipType;
		var acceptableTypes = ['mutual', 'pending', 'waiting'];

		if (acceptableTypes.indexOf(relationshipType) !== -1) {
			client.smembers(setName, function(err, content) {
				console.log(content);
				if (err) {
				    res.status(500).json({
				        error: err
				    });
				} else if (content === undefined){
				    res.status(204).json({
				        error: 'Not Found'
				    });
				}

				res.send(content);
			});
		} else {
	        res.status(400).json({
	    	    error: 'Wrong Params'
	    	});
		}
	})

	.put(function(req, res) {
		var userId = req.params.userId;
		var relationshipType = req.params.type;
	    var userList = req.query.userList;
	    
	    //Here needs some verification! I will come back here later
	    if (userList === undefined) {
	    	res.status(400).json({
	    	    error: 'Params Missing'
	    	});
	    }

	    multi = client.multi();

	    var userArray = userList.split(',');
	    for (var i = 0; i < userArray.length; i++) {
	    	multi.sadd(userId + "_" + relationshipType, userArray[i]);
	    }
	    multi.exec(function (err, replies) {
	    	if (err) {
	    	    res.status(500).json({
	    	        error: err
	    	    });
	    	}
	        res.status(201).json({
	            message: 'Data Updated'
	        });
	    });
	});


router.route('/:userId/:type/:opt')
	//user1/pending/toMutual?userList=user1,user2
	.put(function(req, res) {
		var userId = req.params.userId;
		var optName = req.params.opt;
		var userList = req.query.userList;
		var relationshipType = req.params.type;	
		//Here needs some verification! I will come back here later
		if (userList === undefined) {
			res.status(400).json({
			    error: 'Params Missing'
			});
		}

		if (optName == "toMutual") {
			multi = client.multi();

			var userArray = userList.split(',');
			for (var i = 0; i < userArray.length; i++) {
				multi.smove(userId + "_" + relationshipType, userId + "_mutual", userArray[i]);
			}
			multi.exec(function (err, replies) {
				if (err) {
				    res.status(500).json({
				        error: err
				    });
				}

			    res.status(201).json({
			        message: 'Data Updated'
			    });
			});
		}

		if (optName == "find") {

		}

		if (optName == "...") {

		}

	});
















module.exports = router;

