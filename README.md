# Expressjs & Redis - REST API Sample

Implemented basic REST API. Built with Express.js. Used Redis for data persistence. 

##Endpoint Documentations

###Connection
Description: The token info needs to be added to headers of http request.

Examples: 


###Events
- /api/relationships/:userId
	-	GET: get all relationship data for a user
		Haven't done yet.

	-	POST: create a new user, and create 3 relationship sets automaticly
		Demo Request: POST: /api/relationships/user1 
		Retuen Value: 
		```
			[
			  "user4",
			  "user3",
			  "user2"
			]
		```

- /api/relationships/:userId/:type
	-	GET: get the specific type relationship data of one user
	-	PUT: update specific type of relationship data for one user
	-	DELETE: delete some users in a specific relationship set

- /api/relationship/:userId/:type/:opt
	-	PUT: perform opreation for a specific type of relationship data

###Requirements
Node.js, Expressjs, Redis

