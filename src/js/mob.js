var astar = require('../lib/astar');

var Mob = function(options) {
  this.updateMap(options.levels);
  console.log(this.walkableMap);
  this.targetAgent = options.targetAgent;
  this.width = options.tileSize;
  this.height = options.tileSize;
  this.x = options.x;
  this.y = options.y;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.score = 0;
  // this.getAStarMovement();
};

Mob.prototype.updateMap = function(level) {
  this.levels = level.map;
  this.walkableMap = this.levels.map(function(row) {
    return row.map(function(tile) {
      return tile === 0 ? 'w' : 'u';
    });
  });
};

Mob.prototype.getMap = function() {
  return this.walkableMap.map(function(row) {
    return row.map(function(tile) {
      return tile;
    });
  });
};

Mob.prototype.getAStarMovement = function() {
  var map = this.getMap(),
      path;
      tileX = Math.floor(this.x/this.width);
      tileY = Math.floor(this.y/this.height);
      targetX = Math.floor(this.targetAgent.x/this.width);
      targetY = Math.floor(this.targetAgent.y/this.height);
  // console.log('me', tileX, tileY);
  // console.log('target', targetX, targetY);
  map[tileY][tileX] = 's';
  map[targetY][targetX] = 'g';

  // for (var j = 0; j < map.length; j++) {
  //   var row = ''
  //   for (var i = 0; i < map[j].length; i++) {
  //     row += map[j][i];
  //   }
  //   console.log(row);
  // }

  // console.log('the map', map);
  path = astar(map, 'manhattan', true);
  // console.log('thepath', path[1]);

  if (path && path.length > 1) {
    return {
      x: path[1].col,
      y: path[1].row
    };
  }
  return {
    x: this.x,
    y: this.y};
};

Mob.prototype.moveToTarget = function() {
  var nextMove = this.getAStarMovement();
  var dx = (nextMove.x * this.width) - this.x;
  var dy = (nextMove.y * this.height) - this.y;
  var moveX = dx * 0.3;
  var moveY = dy * 0.3;

  if (moveX) {
    moveX = Math.abs(moveX)/moveX * Math.max(moveX, 0.7);
  }
  if (moveY) {
    moveY = Math.abs(moveY)/moveY * Math.max(moveY, 0.7);
  }
  this.move(moveX, moveY);
}

Mob.prototype.move = function(moveX, moveY) {
  // console.log('next move', moveX, moveY);
  this.x += moveX;
  this.y += moveY;
  this.xSpeed = moveX;
  this.ySpeed = moveY;
};

Mob.prototype.atTarget = function() {
  //TODO: add code for what happens when farmer reaches
  //player
};

Mob.prototype.chooseAction = function() {
  if (
    Math.abs(this.y - this.targetAgent.y) < 1 && Math.abs(this.x - this.targetAgent.x) < 1
  ) {
    this.atTarget();
  }
  else {
    this.moveToTarget();
  }
};

exports.Mob = Mob;
