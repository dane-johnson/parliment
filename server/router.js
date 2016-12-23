const path = require("path");
const express = require("express");

module.exports = function(app, io) {
	app.use(express.static(path.join(__dirname, "../public")));
	app.get("/", function(req, res) {
		res.sendFile(path.resolve(__dirname + "/../index.html"));
	});
	app.get("/bundle.js", function(req, res) {
		res.sendFile(path.resolve(__dirname + "/../bundle.js"));
	});
	app.get("/socket.io.js", function(req, res) {
		res.sendFile(path.resolve(__dirname + "/../node_modules/socket.io-client/dist/socket.io.js"));
	});
}