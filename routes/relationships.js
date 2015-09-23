var express = require('express');
var router = require('../middleware/tokens');
var client = require('../redisClient');

router.route('/')
	.get(function(req, res) {
		client.hgetall("relationship", function(err, obj) {
	        if (err) {
	            res.status(500).json({
	                error: err
	            });
	        }
	        res.send(obj);
	    });
	});
	

router.route('/:userId')

	.get(function(req, res) {
		client.hget("relationship", req.params.userId, function(err, obj) {
		    if (err) {
		        res.status(500).json({
		            error: err
		        });
		    } else if (obj === undefined){
		        res.status(204).json({
		            error: 'Not Found'
		        });
		    }
		    res.send(obj);
		});
	})

	.post(function(req, res) {
		var userId = req.params.userId;
		var data = req.query.data;
		if (data === undefined) {
			data = {
			    "userId": userId,
			    "data": {
			        "mutual": [],
			        "pending": [],
			        "waiting": [],
			        "blocked": []
				}
			};
		}
		//console.log(data);
		client.hset("relationship", userId, JSON.stringify(data), function(err, obj) {
		    if (err) {
		        res.status(500).json({
		            error: err
		        });
		    } else if (userId === undefined || data === undefined) {
		    	res.status(400).json({
		    	    error: 'Params Missing'
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
		client.hget("relationship", req.params.userId, function(err, content) {
			if (err) {
			    res.status(500).json({
			        error: err
			    });
			} else if (content === undefined){
			    res.status(204).json({
			        error: 'Not Found'
			    });
			}
			var obj = JSON.parse(content);
			var resData;
			switch(relationshipType) {
			    case 'mutual':
			        resData = obj.data.mutual;
			        break;
			    case 'pending':
			        resData = obj.data.pending;
			        break;
			    case 'waiting':
			     	resData = obj.data.waiting;
			        break;
		        case 'blocked':
		            resData = obj.data.blocked;
		            break;
			    default:
			        res.status(400).json({
			    	    error: 'Wrong Params'
			    	});
			}
			res.send(resData);
		});
	})

	.put(function(req, res) {
		var userId = req.params.userId;
		var relationshipType = req.params.type;
	    var userList = req.query.userList;
	    
	    if (userList === undefined) {
	    	res.status(400).json({
	    	    error: 'Params Missing'
	    	});
	    }

	    var userArray = userList.split(',');
	    var relationshipData;
	    client.hget("relationship", req.params.userId, function(err, content) {
	    	//Get the data
	    	if (err) {
	    	    res.status(500).json({
	    	        error: err
	    	    });
	    	} else if (content === undefined){
	    	    res.status(204).json({
	    	        error: 'Not Found'
	    	    });
	    	}
	    	
	    	var obj = JSON.parse(content);
	    	switch(relationshipType) {
	    	    case 'mutual':
	    	        relationshipData = obj.data.mutual;
	    	        break;
	    	    case 'pending':
	    	        relationshipData = obj.data.pending;
	    	        break;
	    	    case 'waiting':
	    	     	relationshipData = obj.data.waiting;
	    	        break;
	            case 'blocked':
	                relationshipData = obj.data.blocked;
	                break;
	    	    default:
	    	        res.status(400).json({
	    	    	    error: 'Wrong Params'
	    	    	});
	    	}


	    	for (var i=0; i < userArray.length; i++) {
	    		if (relationshipData.indexOf(userArray[i]) == -1) {
	    			relationshipData.push(userArray[i]);
	    		}
	    	}

	    	obj.data[relationshipType] = relationshipData;
	    	//console.log(obj);

	    	client.hset("relationship", userId, JSON.stringify(obj), function(err) {
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

	});

router.route('/relationships/:userId/:type').delete(function(req, res) {
	var userList;
    var toMutual = false;
});

module.exports = router;

