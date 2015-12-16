/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./app/config/environment');
var passport = require('passport');
var redis   = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var client  = redis.createClient();
var _ = require('lodash')

if(process.env.NODE_ENV === 'development'){
	_.merge(process.env, require('./app/config/local.env'));
}
// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Seed the database
// if(config.seedDB) {
// 	console.log("Seeding database");
// 	require('./app/config/seed');
// }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

require('./app/config/socketio')(socketio);
require('./app/config/express')(app);
require('./app/auth/passport')(passport);
app.use(
  session({
    store: new redisStore({url: process.env.REDIS_URL}),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./app/routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
	console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
