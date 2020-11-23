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

  document.getElementById('score').innerHTML = "Score:" + String(s.len - 1);
  generateFood();
  socket = io.connect('http://localhost:3000');
  socket.on('Update', gotMessage);


}
function gotMessage(data) {
  console.log('recieved message! ' + data['dir']);
  s.xdir = data['xdir'];
  s.yidr = data['ydir'];

  s.dir = data['dir'];


}


function generateFood() {
  let posX = floor(random(actualWidth));
  let posY = floor(random(actualHight));
  food = createVector(posX, posY);
}

function play_sound() {

  var audio = new Audio('Oh_no.mp3');
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
    let head = this.body[this.body.length - 1]
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

    if (x > actualWidth - 1 || y > actualWidth - 1 || x < 0 || y < 0) {

      console.log("DEAD");
      this.gameOver();

      return;
    }
    if (this.body.length > 1) {
      for (var i = 0; i < this.body.length - 1; i++) {
        if (x == this.body[i].x && y == this.body[i].y) {
          this.gameOver();
          return;
        }

      }
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




  }

  show() {
    //show all the snakes body parts
    for (var i = 0; i < this.body.length; i++) {
      blue = 0;
      green = 0;
      red = 0;
      color++;
      if (color % 2 == 0) {red = 255}
      else if (color % 2 > 0) {}
      fill(blue, green, red);

      rect(this.body[i].x, this.body[i].y, 1, 1)
    }
  }
}

//changes direction of snake (can't go backwards)
function keyPressed() {
  //up
  if (key == 'w') {
    s.xdir = 0;
    s.ydir = -1;
    s.dir = "N";
  }
  //right
  else if (key == 'd') {
    s.xdir = 1;
    s.ydir = 0;
    s.dir = "E";
  }
  //left
  else if (key == 'a') {
    s.xdir = -1;
    s.ydir = 0;
    s.dir = "W";
  }
  //down
  else if (key == 's') {
    s.xdir = 0;
    s.ydir = 1;
    s.dir = "S";
  }
  //for debugging
  else if (key == " ") {
    s.grow();
  }



  var data = {
    ydir: s.yidr,
    xdir: s.xdir,
    dir: s.dir
    //'score': this.len - 1

  }
  //var jsonData = JSON.stringify(data);

  console.log("sending: (" + data['dir'] + " )");
  socket.emit('Update', data);


}


function draw() {
  scale(resolution);
  background(0, 200, 0);
  s.update();
  s.show();

  document.getElementById('score').innerHTML = "Score:" + String(s.len - 1);
  noStroke();
  fill(255 / 3, 255 * (1 / 4), 255 * (1 / 4));

  rect(food.x, food.y, 1, 1, 1)
}
