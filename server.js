//import express
const path = require('path');
var express = require('express');
const http = require('http');
const socketio = require('socket.io');


var app = express();
var server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

console.log("my server is running!");


//import sockets

const io = socketio(server);

io.on('connection', socket => {

  console.log(socket + "Connected");


});

