var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	routes = require('./routes').start(express, app)
	sockets = require('./sockets').start(server);

server.listen(80);
console.log('Listening on port 80.');