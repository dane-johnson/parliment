"use strict"

const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const router = require('./router');
const server = http.createServer(app);
const io = require("socket.io")(server);
const Sockets = require("./sockets_server");

app.use(cors());
app.use(bodyParser.json({type: '*/*'}));
router(app, io);

io.on('connection', function(socket){
	var clients = io.sockets.adapter;
	var ioAccess = io.sockets;
	Sockets.initSockets(socket, clients, ioAccess);
});

const port = process.env.PORT || 8080;
server.listen(port);
console.log("Server listening on port: ", port);