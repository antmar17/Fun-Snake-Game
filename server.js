var express = require("express");
var http = require("http");
var sockets = require("socket.io");
//framework for server
var app = express();
var bodyParser = require("body-parser");

app.use(express.static("public"));

var server = http.createServer(app).listen(3000);
//var server = app.listen(3000);

var io = sockets(server);
io.sockets.on("connection", newConnection);

console.log("Server is listening on port 3000");

/* ----------------------------PYTHON BEHAVIORS ----------------------------------*/
//var spawn = require("child_process").spawn,
//  py = spawn("python", ["controller.py"]);
//(data = [1, 2, 3, 4, 5, 6, 7, 8, 9]), (dataString = "");
//
//py.stdout.on("data", function (data) {
//  dataString = data.toString();
//  console.log("data from python! " + data);
//});
//py.stdout.on("end", function () {
//  console.log("An Error has occured");
//});
/* ----------------------------PYTHON BEHAVIORS ----------------------------------*/
var pyList = [];
var socketsTobrain = {};
//holds js socket in
function newConnection(socket) {
  console.log("New connection on socket:" + socket.id);

  /* ----------------------------SERVER BEHAVIORS----------------------------------*/
  socket.on("ChangeDir", getChangeDir);
  socket.on("Update", getUpdate);
  socket.on("disconnect", disonnectHandler);
  socket.on("printPy", printMessage);
  socket.on("Ack", pyAck);
  /* ----------------------------SERVER BEHAVIORS----------------------------------*/

  function getChangeDir(data) {
    socket.broadcast.emit("ChangeDir", data);
  }

  function getUpdate(update) {
    socket.broadcast.emit("msg", JSON.stringify(update));
  }
  function printMessage(sid) {
    pyList.push(socket.id);
    console.log("Hello from python!: " + sid);
  }

  function pyAck(data) {
    console.log("py recieved: " + JSON.parse(data));
  }

  function disonnectHandler() {
    console.log("Disconnected" + socket.id);
  }
}
