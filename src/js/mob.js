var astar = require('../lib/astar');
var game = require('./app.js');

var Mob = function(options) {
  this.updateMap(options.levels);
  this.targetAgent = options.targetAgent;
  this.width = options.tileSize;
  this.height = options.tileSize;
  this.tileSize = options.tileSize;
  this.x = options.x;
  this.y = options.y;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.score = 0;
  this.sprite = new Image();
  this.facing = 'down';
  this.context = options.context;
  this.active = true;
};

Mob.prototype.draw = function() {
  var singleTileSpec;

  switch (this.facing) {
		case 'up':
			this.sprite.src = './img/farmerUp.png';
      singleTileSpec = {
        x: 0,
        y: 0
      };
			break;
		case 'left':
			this.sprite.src = './img/farmerLeft.png';
      singleTileSpec = {
        x: 0,
        y: 0
      };
			break;
		case 'down':
			this.sprite.src = './img/farmerDown.png';
      singleTileSpec = {
        x: 0,
        y: 0
      };
			break;
		case 'right':
			this.sprite.src = './img/farmerRight.png';
      singleTileSpec = {
        x: 0,
        y: 0
      };
			break;
		default:
	}
  this.context.drawImage(
		this.sprite,
		singleTileSpec.x, singleTileSpec.y, this.tileSize, this.tileSize,
		Math.floor(this.x), Math.floor(this.y), this.tileSize, this.tileSize
	);
};

//retrieves level and converts map to walkable (w) vs
// unwalkable (u) tiles for pathfinding
Mob.prototype.updateMap = function(level) {
  this.levels = level.map;
  this.walkableMap = this.levels.map(function(row) {
    return row.map(function(tile) {
      if (tile === 11 || tile === 0) {
        return 'w'
      }
      else {
        return 'u'
      }
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
};

//movement pattern for mob
Mob.prototype.move = function(moveX, moveY) {
  this.x += moveX;
  this.y += moveY;
  this.xSpeed = moveX;
  this.ySpeed = moveY;

  // used to determine which sprite to render based on
  // direction gerald is facing

  if (moveX > 0) {
    this.facing = 'right';
  }
  else if (moveX < 0) {
    this.facing = 'left';
  }
  else if (moveY > 0) {
    this.facing = 'up';
  }
  else if (moveY < 0) {
    this.facing = 'down';
  }
  else {
    this.facing = 'down';
  }
};

Mob.prototype.atTarget = function() {
  game.setGameCycle();
  $('.death-wrapper').animate({left: "0"}).on('click', 'button', function() {
    $('.death-wrapper').animate({left: '-100vw', display: 'none'});
    $(this).blur(); // lose focus on the start again button otherwise it's triggered by spacebar.
  })
};

Mob.prototype.chooseAction = function() {
  if ( // best distance i could fine without it crashing
    Math.abs(this.y - this.targetAgent.y) < 25 && Math.abs(this.x - this.targetAgent.x) < 25
  ) {
    this.atTarget();
  }
  else {
    this.moveToTarget();
  }
};

Mob.prototype.explode = function() {
  this.active = false;
};

exports.Mob = Mob;
