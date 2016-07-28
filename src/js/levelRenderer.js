var mob = require('./mob');
var mobCollision = require('./mob.collision');

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
  this.mobs = [];
  this.killMobs = false;
};

//general drawing function for all tiles
Renderer.prototype.drawTile = function(sprite, singleTileSpec, x, y) {
	this.context.drawImage(
		sprite,
		singleTileSpec.x, singleTileSpec.y, this.tileSize, this.tileSize,
		Math.floor(x * this.tileSize), Math.floor(y * this.tileSize), this.tileSize, this.tileSize
	);
};

Renderer.prototype.render = function() {
  // if new level, clear out mobs array
  if (this.killMobs) {
    this.mobs = [];
    this.killMobs = false;
  }
  // clear the canvas
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  for (var i = 0; i<this.levelRows; i++){
    for(var j = 0; j<this.levelCols; j++){
      if(this.levels.map[i][j] !== 0 && this.levels.map[i][j] < 2) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[this.levels.map[i][j]], j, i);
      }
      else if (this.levels.map[i][j] === 10) {
        this.drawTile(this.stairTileset.sprite, this.stairTileset.tileSpec[1], j, i);
      }
      else if (this.levels.map[i][j] === 11) {
        this.drawTile(this.pickupTileset.sprite, this.pickupTileset.tileSpec[1], j, i);
      }
      else if (this.levels.map[i][j] === 12) {
        // console.log(this.levels.map[i].indexOf(12));
        this.mobs.push(new mob.Mob({
          x: this.levels.map[i].indexOf(12) * 32,
          y: i * 32,
          tileSize: this.tileSize,
          targetAgent: this.playerClass,
          levels: this.levels //for astar
        }))
        this.levels.map[i][j] = 0;
      }
    }
  }



  // this.playerClass.daw();
  this.playerClass.playerProjectiles.forEach(function(projectile) {
    projectile.draw();
  });

  //renders gerald
  this.drawTile(this.charTileset.sprite, this.charTileset.tileSpec[1], this.playerClass.x/this.playerClass.width, this.playerClass.y/this.playerClass.height);

  //renders mob
  this.mobs.forEach(mob => {
    this.drawTile(this.farmerTileset.sprite, this.farmerTileset.tileSpec[1], mob.x/mob.width, mob.y/mob.height);
    mob.chooseAction();

    // parameters for mob collisions
    var collisionParams = {
			entity: mob,
			tileSize: this.tileSize,
			levels: this.levels
		};
    // intiate mob collision handling
    mobCollision.mobCollision(collisionParams);
  })
  //this.drawTile(this.farmerTileset.sprite, this.farmerTileset.tileSpec[1], this.mobClass.x/this.mobClass.width, this.mobClass.y/this.mobClass.height);
};

exports.Renderer = Renderer;
