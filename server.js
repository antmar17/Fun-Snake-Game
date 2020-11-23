var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(3000);


app.use(express.static('public'));
console.log("Server has started!");


var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {

  console.log("New connection on socket:" + socket.id);

  socket.on('Update', getUpdate);

  function getUpdate(data) {
    socket.broadcast.emit('Update', data);

  }


}



