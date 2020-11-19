function Bloc() {
  this.pos = createVector(width / 2, height / 2);
  this.r = 64;
}

this.show = function () {
  fill(255);
  eclipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

}


