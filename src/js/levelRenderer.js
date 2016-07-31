var mob = require('./mob');
var mobCollision = require('./mob.collision');
var projectileCollision = require('./projectile.collision');

var Renderer = function(options) {
  this.canvas = options.canvas;
  this.context = options.context;
  this.levelRows = options.levelRows;
  this.levelCols = options.levelCols;
  this.levels = options.levels;
  this.playerClass = options.playerClass;
  this.mobClass = options.mobClass;
  this.bgTileset = options.bgTileset;
  this.charTileset = options.charTileset;
  this.stairTileset = options.stairTileset;
  this.farmerTileset = options.farmerTileset;
  this.tileSize = options.tileSize;
  this.pickupTileset = pickupTileset;
  this.doorTileset = options.doorTileset;
  this.mobs = [];
  this.killMobs = false;
  this.time = Date.now(); // for spawning mobs every x seconds
  this.enemyCoords = []; // for spawning mobs in the same place
};

// general drawing function for all tiles
Renderer.prototype.drawTile = function(sprite, singleTileSpec, x, y) {
	this.context.drawImage(
		sprite,
		singleTileSpec.x, singleTileSpec.y, this.tileSize, this.tileSize,
		Math.floor(x * this.tileSize), Math.floor(y * this.tileSize), this.tileSize, this.tileSize
	);
};

Renderer.prototype.render = function(levels, tileSize) {
  // if new level, clear out mobs array, previous enemy coords and resest the spawn timer;
  if (this.killMobs) {
    this.mobs = [];
    this.enemyCoords = [];
    this.time = Date.now();
    this.killMobs = false;
  }
  // clear the canvas
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  // render level sprites (walls, stairs, trash cans)
  for (var i = 0; i<this.levelRows; i++) {
    for(var j = 0; j<this.levelCols; j++) {
      if(this.levels.map[i][j] !== 0 && this.levels.map[i][j] < 2) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[this.levels.map[i][j]], j, i);
      }
      else if (this.levels.map[i][j] === 3) {
        this.drawTile(this.stairTileset.sprite, this.stairTileset.tileSpec[1], j, i);
      }
      else if (this.levels.map[i][j] === 4) {
        this.drawTile(this.pickupTileset.sprite, this.pickupTileset.tileSpec[1], j, i);
      }
      else if (this.levels.map[i][j] === 5) {
        this.drawTile(this.doorTileset.sprite, this.doorTileset.tileSpec[1], j, i);
      }

      else if (this.levels.map[i][j] === 9) {
        this.enemyCoords.push({x: j * 32, y: i * 32}); // save enemy coords for spawning
        this.mobs.push(new mob.Mob({
          x: j * 32,
          y: i * 32,
          tileSize: this.tileSize,
          context: this.context,
          targetAgent: this.playerClass,
          levels: this.levels //for astar
        }))
        this.levels.map[i][j] = 0;
      }
    }
  };

  this.playerClass.draw();

  this.playerClass.playerProjectiles.forEach(function(projectile) {
    projectileCollision.projectileCollision({projectile: projectile, mobs: this.mobs, tileSize: tileSize}, levels);
  }, this);

  this.playerClass.playerProjectiles.forEach(function(projectile) {
    projectile.draw();
  });

  // kills mob upon collision
  this.mobs.forEach(mob => {
    if (mob.active === false) {
      var mobIndex = this.mobs.indexOf(mob);

      this.mobs.splice(mobIndex, 1);
    }
  });

  // add new mob after 4 secs but not too many :D
  if (Date.now() - this.time > 4000 && this.mobs.length < 8) {
    this.enemyCoords.forEach(coord => {
      this.mobs.push(new mob.Mob({
        x: coord.x,
        y: coord.y,
        tileSize: this.tileSize,
        context: this.context,
        targetAgent: this.playerClass,
        levels: this.levels //for astar
      }))
      this.time = Date.now();
    })
    
  }

  // renders mob
  this.mobs.forEach(mob => {
      mob.chooseAction();

      // parameters for mob collisions
      var collisionParams = {
        entity: mob,
        tileSize: this.tileSize,
        levels: this.levels
      };
      // initiate mob collision handling
      mobCollision.mobCollision(collisionParams);
      mob.draw();
  });
};

exports.Renderer = Renderer;
