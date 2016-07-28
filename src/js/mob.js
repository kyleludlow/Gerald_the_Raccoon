var astar = require('../lib/astar');

var Mob = function(options) {
  this.updateMap(options.levels);
  this.targetAgent = options.targetAgent;
  this.width = options.tileSize;
  this.height = options.tileSize;
  this.x = options.x;
  this.y = options.y;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.score = 0;
};

//retrieves level and converts map to walkable (w) vs
// unwalkable (u) tiles for pathfinding
Mob.prototype.updateMap = function(level) {
  // console.log(level);
  this.levels = level.map;
  this.walkableMap = this.levels.map(function(row) {
    return row.map(function(tile) {
      if (tile === 11 || tile === 0) {
        return 'w'
      }
      else {
        return 'u'
      }
      // return tile === 0 ? 'w' : 'u';
    })
  });
};

//individualizes map tiles
Mob.prototype.getMap = function() {
  return this.walkableMap.map(function(row) {
    return row.map(function(tile) {
      return tile;
    });
  });
};

//calculates location of start (s--where the monster is)
//and goal (g--where the player is)
Mob.prototype.getAStarMovement = function() {
  var map = this.getMap(),
      path;
      tileX = Math.floor(this.x/this.width);
      tileY = Math.floor(this.y/this.height);
      targetX = Math.floor(this.targetAgent.x/this.width);
      targetY = Math.floor(this.targetAgent.y/this.height);
  map[tileY][tileX] = 's';
  map[targetY][targetX] = 'g';


  // calculates best path between s and g
  //map === level map
  //'manhattan' === "discovery" of g method
  //true === allows monster to cut corners
  path = astar(map, 'manhattan', true);

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

//provides information for where mob should move
Mob.prototype.moveToTarget = function() {
  var nextMove = this.getAStarMovement();
  var dx = (nextMove.x * this.width) - this.x;
  var dy = (nextMove.y * this.height) - this.y;
  var moveX = dx * 0.03;
  var moveY = dy * 0.03;

  if (moveX) {
    moveX = Math.abs(moveX)/moveX * Math.max(moveX, 1.25);
  }
  if (moveY) {
    moveY = Math.abs(moveY)/moveY * Math.max(moveY, 1.25);
  }

  this.move(moveX, moveY);
}

//movement pattern for mob
Mob.prototype.move = function(moveX, moveY) {
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
