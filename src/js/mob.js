var Mob = function(options) {
  this.color = '#ffffff';
  this.targetAgent = options.targetAgent;
  this.x = options.playerXPos;
  this.y = options.playerYPos;
  this.width = options.tileSize;
  this.height = options.tileSize;
  this.position = options.position;
};

Mob.prototype.update = function() {
  var dx = this.targetAgent.position.x - this.position.x,
      dy = this.targetAgent.position.y - this.position.y,
      moveX = dx * 0.03,
      moveY = dy * 0.03,
      absX = Math.abs(moveX),
      abxY = Math.abs(moveY);
  moveX = absX/moveX * Math.max(absX, 0.05);
  moveY = abxY/moveY * Math.max(absY, 0.05);
  return {
    x: moveX,
    y: moveY
  };
};

exports.Mob = Mob;
