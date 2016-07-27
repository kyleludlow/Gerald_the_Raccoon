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
  // clear the canvas
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  for (var i = 0; i<this.levelRows; i++){
    for(var j = 0; j<this.levelCols; j++){
      if(this.levels.map[i][j] !== 0 && this.levels.map[i][j] < 10) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[this.levels.map[i][j]], j, i);
      }
      else if (this.levels.map[i][j] === 11) {
        this.drawTile(this.pickupTileset.sprite, this.pickupTileset.tileSpec[1], j, i);
      }
      else if (this.levels.map[i][j] === 10) {
        this.drawTile(this.stairTileset.sprite, this.stairTileset.tileSpec[1], j, i);
      }
    }
  }
  // this.playerClass.draw();
  this.playerClass.playerProjectiles.forEach(function(projectile) {
    projectile.draw();
  });

  //renders gerald
  this.drawTile(this.charTileset.sprite, this.charTileset.tileSpec[1], this.playerClass.x/this.playerClass.width, this.playerClass.y/this.playerClass.height);

  //renders mob
  this.drawTile(this.farmerTileset.sprite, this.farmerTileset.tileSpec[1], this.mobClass.x/this.mobClass.width, this.mobClass.y/this.mobClass.height);
};

exports.Renderer = Renderer;
