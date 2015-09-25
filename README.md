# Expressjs & Redis - REST API Sample

Implemented basic REST API. Built with Express.js. Used Redis for data persistence. 

##Endpoint Documentations

###Connection
Description: The token info needs to be added to headers of http request.

Examples: 

###Events
- /api/relationships/:userId
	-	GET: get all relationship data for a user
		- Haven't done yet.
	-	POST: create a new user, and create 3 relationship sets automaticly
		- Notice: If the user is already in the database, this api will erase all relationship data of this user
		- Usage: ```POST: /api/relationships/:userId```			
		- Demo Request: ```POST: /api/relationships/user1``` 
		- Retuen Value: ```{ "message": "Object Created"}```
- /api/relationships/:userId/:type
	- GET: get the specific type relationship data of one user
		- Usage: ```GET: /api/relationships/:userId/:type```
		- Demo Request: ```/api/relationships/user1/mutual```
		- Return Value: ```["user4", "user3", "user2"]```
	- PUT: update specific type of relationship data for one user, Param userList is required
		- Notice: Single or mutiple users are accpetable. Users are separate by comma(,)
		- Usage: ```PUT: /api/relationships/:userId/:type?userList={users}```
		- Demo Request: ```PUT: /api/relationships/user1/pending?userList=user4,user5```
		- Return Value: ```{"message": "Data Updated"}```
	- DELETE: delete some users in a specific relationship set
		- Notice: Haven't done yet.
		- Usage: ```DELETE: /api/relationships/:userId/:type```
- /api/relationship/:userId/:type/:opt
	- PUT: perform opreation for a specific type of relationship data
		- Usage: ```PUT: /api/relationships/:userId/:type/:opt```
		- Demo Request: ```PUT: /api/relationships/user1/pending/toMutual?userList=user2,user3```
		- Return Value: ```{"message": "Data Updated"}```


