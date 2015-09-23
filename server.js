
// Packages
var express = require('express'),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	app = express();

//var employees = require('./routes/employees');
var relationships = require('./routes/relationships');

// Configuration
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(logger('dev'));


// REGISTER OUR ROUTES -------------------------------
//app.use('/api/employees', employees);
app.use('/api/relationships', relationships);

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080; 
app.listen(port);
console.log('Server is listening on port: ' + port);
