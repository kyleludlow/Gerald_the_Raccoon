var tileset = require('./tileset');

var Renderer = function(options) {
  this.canvas = options.canvas;
  this.context = options.context;
  this.levelRows = options.levelRows;
  this.levelCols = options.levelCols;
  this.levels = options.levels;
  this.playerClass = options.playerClass;
  this.playerProjectiles = options.playerProjectiles;
  this.bgTileset = options.bgTileset;
  this.charTileset = options.charTileset;
  this.tileSize = options.tileSize;
  console.log('THIS', this);
};

Renderer.prototype.drawTile = function(sprite, singleTileSpec, x, y) {
  // console.log('i am drawing shit', sprite);
	this.context.drawImage(
		sprite,
		singleTileSpec.x, singleTileSpec.y, this.tileSize, this.tileSize,
		Math.floor(x * this.tileSize), Math.floor(y * this.tileSize), this.tileSize, this.tileSize
	);
};

Renderer.prototype.render = function() {
    // clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // walls = red boxes
    for(var i=0;i<this.levelRows;i++){
        for(var j=0;j<this.levelCols;j++){
            if(this.levels.map[i][j] !== 0 && this.levels.map[i][j] < 10){
                this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[this.levels.map[i][j]], j, i);
            }
            else if (this.levels.map[i][j] === 10) {
                this.context.fillStyle = "#000000";
                this.context.fillRect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }
    // playerClass.draw();
    // playerProjectiles.forEach(function(projectile) {
    //     projectile.draw();
    // });
    this.drawTile(this.charTileset.sprite, this.charTileset.tileSpec[1], this.playerClass.x/this.playerClass.width, this.playerClass.y/this.playerClass.height);
};

exports.Renderer = Renderer;
