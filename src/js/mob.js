var Mob = function(options) {
  this.targetAgent = options.targetAgent;
  this.width = options.tileSize;
  this.height = options.tileSize;
  this.x = options.x;
  this.y = options.y;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.score = 0;
};

Mob.prototype.move = function(moveX, moveY) {
  this.x += moveX;
  this.y += moveY;
  this.xSpeed = moveX;
  this.ySpeed = moveY;
};

Mob.prototype.update = function() {
  var dx = this.targetAgent.x - this.x,
      dy = this.targetAgent.y - this.y,
      moveX = dx * 0.03,
      moveY = dy * 0.03,
      absX = Math.abs(moveX),
      absY = Math.abs(moveY);
  moveX = absX/moveX * Math.max(absX, 0.05);
  moveY = absY/moveY * Math.max(absY, 0.05);

  this.move(moveX, moveY);
};

exports.Mob = Mob;
