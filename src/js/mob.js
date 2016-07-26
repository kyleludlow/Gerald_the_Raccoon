var Mob = function(options) {
  this.targetAgent = options.targetAgent;
  this.width = options.tileSize;
  this.height = options.tileSize;
  this.position = options.position;
};

Mob.prototype.move = function(moveX, moveY) {
  this.position.x += moveX;
  this.position.y += moveY;
};

Mob.prototype.update = function() {
  var dx = this.targetAgent.x - this.position.x,
      dy = this.targetAgent.y - this.position.y,
      moveX = dx * 0.03,
      moveY = dy * 0.03,
      absX = Math.abs(moveX),
      absY = Math.abs(moveY);
  moveX = absX/moveX * Math.max(absX, 0.05);
  moveY = absY/moveY * Math.max(absY, 0.05);

  this.move(moveX, moveY);
};

exports.Mob = Mob;
