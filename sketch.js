let s;
let food;
let resolution = 10;
let score = 0;
let total = 1;
let actualWidth;
let actualHight;

function setup() {
  createCanvas(500, 500);
  actualWidth = floor(width / resolution);

  actualHight = floor(height / resolution);
  frameRate(20);

  s = new Snake();
  generateFood();

}


function generateFood() {
  let posX = floor(random(actualWidth));
  let posY = floor(random(actualHight));
  food = createVector(posX, posY);
}





class Snake {

  constructor() {

    //Keep track of all vectors in snake (have them reference vector in front of them)
    this.body = [];
    this.body[0] = createVector(0, 0);

    //keep track of the direction the snake is moving in
    this.xdir = 1;
    this.ydir = 0;

    //keep track of length of snake
    this.len = 1

  }



  grow() {

    this.len++;

  }
  eat(foodPos) {
    let x = this.body[0].x;
    let y = this.body[0].y;

    if (foodPos.x === x && foodPos.y === y) {
      console.log("FOOD EATEN");
      generateFood();
      this.grow();


    }
  }

  update() {
    this.eat(food)
    this.body[0].x += this.xdir;
    this.body[0].y += this.ydir;

  }
  show() {

    for (var i = 0; i < this.body.length; i++) {
      fill(0, 0, 255);
      rect(this.body[i].x, this.body[i].y, 1, 1)
    }
  }
}

//changes direction of snake
function keyPressed() {
  //up
  if (key == 'w') {
    s.xdir = 0;
    s.ydir = -1;

  }
  //right
  else if (key == 'd') {
    s.xdir = 1;
    s.ydir = 0;

  }
  //left
  else if (key == 'a') {
    s.xdir = -1;
    s.ydir = 0;

  }
  //down
  else if (key == 's') {
    s.xdir = 0;
    s.ydir = 1;
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
