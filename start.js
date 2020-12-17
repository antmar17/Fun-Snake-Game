const { randomInt } = require("crypto");

var spawn = require("child_process").spawn,
  py = spawn("python", ["client.py"]),
  data = randomInt(100),
  dataString = "";

/*Here we are saying that every time our node application receives data from the python process output stream(on 'data'), we want to convert that received data into a string and append it to the overall dataString.*/

/*Once the stream is done (on 'end') we want to simply log the received data to the console.*/
py.stdout.on("end", function () {
  console.log("An error as occured");
});

/*We have to stringify the data first otherwise our python process wont recognize it*/
py.stdin.write(JSON.stringify(data));

py.stdin.end();
