let s;
let food;
let resolution = 10;
let score = 0;
let total = 1;
let actualWidth;
let actualHight;

function setup() {
  createCanvas(400, 400);
  actualWidth = floor(width / resolution);

  actualHight = floor(height / resolution);
  frameRate(15);

  s = new Snake();
  generateFood();

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
    this.dir = "E";
    //keep track of length of snake
    this.len = 1

  }



  grow() {

    this.len++;
    let head = this.body[this.body.length - 1];
    this.body.push(createVector(head.x, head.y));
  }
  eat(foodPos) {
    let head = this.body[this.body.length - 1]
    let x = head.x;
    let y = head.y;

    if (foodPos.x === x && foodPos.y === y) {
      generateFood();
      this.grow();


    }
  }
  gameOver() {
    this.len = 1;
    play_sound();
    this.body = [];
    this.body[0] = createVector(floor(actualWidth / 2), floor(actualHight / 2));
    //keep track of the direction the snake is moving in
    this.xdir = 1;
    this.ydir = 0;
    this.dir = "E";
    //keep track of length of snake
    this.len = 1
    generateFood();

  }
  deathCheck() {
    let head = this.body[this.body.length - 1];
    let x = head.x;
    let y = head.y;

    if (x > actualWidth || y > actualWidth || x < 0 || y < 0) {

      console.log("DEAD");
      this.gameOver();

    }
  }

  update() {
    //checks if hit food
    this.eat(food);

    //check for gameOver
    this.deathCheck();

    let head = this.body[this.body.length - 1].copy();
    this.body.shift();

    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);

  }
  show() {
    //show all the snakes body parts
    for (var i = 0; i < this.body.length; i++) {
      fill(0, 0, 255);
      rect(this.body[i].x, this.body[i].y, 1, 1)
    }
  }
}

//changes direction of snake (can't go backwards)
function keyPressed() {
  //up
  if (key == 'w' && s.dir != "S") {
    s.xdir = 0;
    s.ydir = -1;
    s.dir = "N";
  }
  //right
  else if (key == 'd' && s.dir != "W") {
    s.xdir = 1;
    s.ydir = 0;
    s.dir = "E";
  }
  //left
  else if (key == 'a' && s.dir != "E") {
    s.xdir = -1;
    s.ydir = 0;
    s.dir = "W";
  }
  //down
  else if (key == 's' && s.dir != "N") {
    s.xdir = 0;
    s.ydir = 1;
    s.dir = "S";
  }
  //for debugging
  else if (key == " ") {
    s.grow();
  }
}


function draw() {
  scale(resolution);
  background(0, 200, 0);
  s.update();
  s.show();
  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1)
}
