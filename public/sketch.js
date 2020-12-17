let s;
let food;
let resolution = 20;
let score = 0;
let total = 1;
let actualWidth;
let actualHight;
let color = 0;
var socket;

function setup() {
  createCanvas(500, 500);
  actualWidth = floor(width / resolution);
  actualHight = floor(height / resolution);

  frameRate(15);
  s = new Snake();

  document.getElementById("score").innerHTML = "Score:" + String(s.len - 1);
  generateFood();
  socket = io.connect("http://localhost:3000");
  socket.on("ChangeDir", changeSnakeDir);

  socket.on("message", printTime);
}
function printTime(time) {
  console.log(time);
}

function distance(x0, y0, x1, y1) {
  a = x0 - x1;
  b = y0 - y1;
  return Math.sqrt(a * a + b * b);
}

function changeSnakeDir(data) {
  console.log(data);
  let x = data["xdir"];
  let y = data["ydir"];
  let d = data["dir"];

  console.log("recieving: (" + x + " " + y + " )");
  s.xdir = x;
  s.ydir = y;

  s.dir = d;
}
function generateFood() {
  let posX = floor(random(actualWidth));
  let posY = floor(random(actualHight));
  food = createVector(posX, posY);
}

function play_sound() {
  var audio = new Audio("Oh_no.mp3");
  audio.play();
}

class Snake {
  constructor() {
    //Keep track of all vectors in snake (have them reference vector in front of them)
    this.body = [];
    this.body[0] = createVector(floor(actualWidth / 2), floor(actualHight / 2));
    //keep track of the direction the snake is moving in
    this.xdir = 1;
    this.ydir = 0;
    //keep track of length of snake
    this.len = 1;
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();

    this.body.push(createVector(head.x, head.y));

    console.log(head.x + "," + head.y);
  }
  eat(foodPos) {
    let head = this.body[this.body.length - 1];
    let x = head.x;
    let y = head.y;

    if (foodPos.x === x && foodPos.y === y) {
      generateFood();

      this.len++;
      this.grow();
    }
  }
  gameOver() {
    this.body = [];
    this.body[0] = createVector(floor(actualWidth / 2), floor(actualHight / 2));
    //keep track of the direction the snake is moving in
    this.xdir = 1;
    this.ydir = 0;
    this.dir = "E";
    //keep track of length of snake
    this.len = 1;
    generateFood();
  }
  deathCheck() {
    let head = this.body[this.body.length - 1];
    let x = head.x;
    let y = head.y;

    //check if smashed into wall
    if (x > actualWidth - 1 || y > actualWidth - 1 || x < 0 || y < 0) {
      console.log("DEAD");
      this.gameOver();

      return;
    }

    //check if smashed into self
    if (this.body.length > 1) {
      for (var i = 0; i < this.body.length - 1; i++) {
        if (x == this.body[i].x && y == this.body[i].y) {
          this.gameOver();
          return;
        }
      }
    }
  }

  getDangerN() {
    var head = this.body[this.body.length - 1];
    var hx = head.x;
    var hy = head.y;
    //check for wall
    if (hy - 1 < 0) {
      return 1;
    }

    //check if smashed into self
    if (this.body.length > 1) {
      for (var i = 0; i < this.body.length - 1; i++) {
        if (hy - 1 == this.body[i].y && hx == this.body[i].x) {
          return 1;
        }
      }
    }
    return 0;
  }

  getDangerW() {
    var head = this.body[this.body.length - 1];
    var hx = head.x;
    var hy = head.y;
    //check for wall
    if (hx - 1 < 0) {
      return 1;
    }

    //check if smashed into self
    if (this.body.length > 1) {
      for (var i = 0; i < this.body.length - 1; i++) {
        if (hx - 1 == this.body[i].x && hy == this.body[i].y) {
          return 1;
        }
      }
    }
    return 0;
  }

  getDangerE() {
    var head = this.body[this.body.length - 1];
    var hx = head.x;
    var hy = head.y;
    //check for wall
    if (hx + 1 > actualWidth - 1) {
      return 1;
    }

    //check if smashed into self
    if (this.body.length > 1) {
      for (var i = 0; i < this.body.length - 1; i++) {
        if (hx + 1 == this.body[i].x && hy == this.body[i].y) {
          return 1;
        }
      }
    }
    return 0;
  }

  getDangerS() {
    var head = this.body[this.body.length - 1];
    var hx = head.x;
    var hy = head.y;
    //check for wall
    if (hy + 1 > actualHight - 1) {
      return 1;
    }

    //check if smashed into self
    if (this.body.length > 1) {
      for (var i = 0; i < this.body.length - 1; i++) {
        if (hy + 1 == this.body[i].y && hx == this.body[i].x) {
          return 1;
        }
      }
    }
    return 0;
  }

  //[left,center,right]
  getDanger() {
    let dangerArray = [0, 0, 0];

    if (this.dir == "N") {
      dangerArray[0] = this.getDangerW();
      dangerArray[1] = this.getDangerN();
      dangerArray[2] = this.getDangerE();
      return dangerArray;
    } else if (this.dir == "W") {
      dangerArray[0] = this.getDangerS();
      dangerArray[1] = this.getDangerW();
      dangerArray[2] = this.getDangerN();

      return dangerArray;
    } else if (this.dir == "E") {
      dangerArray[0] = this.getDangerN();
      dangerArray[1] = this.getDangerE();
      dangerArray[2] = this.getDangerS();
      return dangerArray;
    } else if (this.dir == "S") {
      dangerArray[0] = this.getDangerW();
      dangerArray[1] = this.getDangerS();
      dangerArray[2] = this.getDangerE();
      return dangerArray;
    }
  }
  update() {
    this.deathCheck();
    //checks if hit food
    this.eat(food);

    //check for gameOver

    let head = this.body[this.body.length - 1].copy();
    this.body.shift();

    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);
    let dangers = this.getDanger();
    let updateData = {
      dangers: dangers,
      hx: head.x,
      hy: head.y,
      fx: food.x,
      fy: food.y,
      score: this.len - 1,
    };
    socket.emit("Update", updateData);
  }

  show() {
    //show all the snakes body parts
    for (var i = 0; i < this.body.length; i++) {
      blue = 0;
      green = 0;
      red = 0;
      color++;
      if (color % 2 == 0) {
        red = 255;
      } else if (color % 2 > 0) {
      }
      fill(blue, green, red);

      rect(this.body[i].x, this.body[i].y, 1, 1);
    }
  }
}

//changes direction of snake (can't go backwards)
function keyPressed() {
  //up
  if (key == "w") {
    s.xdir = 0;
    s.ydir = -1;
    s.dir = "N";
  }
  //right
  else if (key == "d" && s.dir != "W") {
    s.xdir = 1;
    s.ydir = 0;
    s.dir = "E";
  }
  //left
  else if (key == "a" && s.dir != "E") {
    s.xdir = -1;
    s.ydir = 0;
    s.dir = "W";
  }
  //down
  else if (key == "s" && s.dir != "N") {
    s.xdir = 0;
    s.ydir = 1;
    s.dir = "S";
  }
  //for debugging
  else if (key == " ") {
    s.grow();
  }
  var data = {
    ydir: s.ydir,
    xdir: s.xdir,
    dir: s.dir,
    //'score': this.len - 1
  };
  //var jsonData = JSON.stringify(data);

  console.log("sending: (" + data["xdir"] + data["ydir"] + " )");
  socket.emit("ChangeDir", data);
}

function draw() {
  scale(resolution);
  background(0, 200, 0);
  s.update();
  s.show();

  document.getElementById("score").innerHTML = "Score:" + String(s.len - 1);
  noStroke();
  fill(255 / 3, 255 * (1 / 4), 255 * (1 / 4));

  rect(food.x, food.y, 1, 1, 1);
}
