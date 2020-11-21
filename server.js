//import express
var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("my server is running!");

var socket = recquire('socket.io');
io.sockets.on('connection', newConnection);

//process for new connection
function newConnection(socket) {

  console.log(socket + "Connected");

}
