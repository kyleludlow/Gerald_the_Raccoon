var tileset = require('./tileset');

(function(){

	var canvas = document.getElementById("canvas");   // the canvas where game will be drawn
	var context = canvas.getContext("2d");            // canvas context
	var levelRenderer = require('./levelRenderer');
	var renderer = null;
	var levelManager = require('./levelManager');
	var levels = levelManager.LevelChoice(1);

	var collisionManager = require('./collisionManager');

	var levelCols = levels.map[0].length;				// level width, in tiles
	var levelRows = levels.map.length;					// level height, in tiles
	var tileSize = 32;												  // tile size, in pixels
	var playerCol = levels.playerCol;          // player starting column
	var playerRow = levels.playerRow;          // player starting row
	var leftPressed = false;                   // are we pressing LEFT arrow key?
	var rightPressed = false;                  // are we pressing RIGHT arrow key?
	var upPressed = false;                     // are we pressing UP arrow key?
	var downPressed = false;                  // are we pressing DOWN arrow key?
	var spacePressed = false;                  // are we pressing space key?
	var movementSpeed = 5;                    // the speed we are going to move, in pixels per frame

	var playerYPos = playerRow * tileSize;		// converting Y player position from tiles to pixels
	var playerXPos = playerCol * tileSize;   // converting X player position from tiles to pixels

	canvas.width = tileSize * levelCols;   // canvas width. Won't work without it even if you style it from CSS
	canvas.height = tileSize * levelRows;  // canvas height. Same as before

	var makeProjectile = require('./projectile').makeProjectile;

	// simple WASD listeners

	document.addEventListener("keydown", function(e) {
		// console.log(e.keyCode);
		switch(e.keyCode){
			case 65:
				leftPressed=true;
				break;
			case 87:
				upPressed=true;
				break;
			case 68:
				rightPressed=true;
				break;
			case 83:
				downPressed=true;
				break;
			case 32:
				spacePressed=true;
				break;
		}
	}, false);

	document.addEventListener("keyup", function(e) {
		switch(e.keyCode){
			case 65:
				leftPressed = false;
				break;
			case 87:
				upPressed = false;
				break;
			case 68:
				rightPressed = false;
				break;
			case 83:
				downPressed = false;
				break;
			case 32:
				spacePressed = false;
		}
	}, false);

var playerProjectiles = [];

var playerClass = {
	color: '#00ff00',
	x: playerXPos,
	y: playerYPos,
	width: tileSize,
	height: tileSize,
	xSpeed: 0,					// player horizontal speed, in pixels per frame
	ySpeed: 0,					// player vertical speed, in pixels per frame
	facing: 'up',
	//draw: function() {

		// drawTile(charTileset.sprite, charTileset.tileSpec[1], this.x/this.width, this.y/this.height);

		// context.fillStyle = this.color;
		// context.fillRect(this.x, this.y, this.width, this.height);
	//},
	update: function() {
		// no friction or inertia at the moment, so at every frame initial speed is set to zero
		this.xSpeed = 0;
		this.ySpeed = 0;

		// shoot projectile if space pressed
		if (spacePressed){
			this.shoot();
		}

		// updating speed according to key pressed
		if (rightPressed){
			this.xSpeed = movementSpeed;
			this.facing = 'right';
		}
		else {
			if (leftPressed) {
				this.xSpeed = -movementSpeed;
				this.facing = 'left';
			}
			else {
				if(upPressed) {
					this.ySpeed = -movementSpeed;
					this.facing = 'up';
				}
				else {
					if (downPressed) {
						this.ySpeed = movementSpeed;
						this.facing = 'down';
					}
				}
			}
		}

		// updating player position
		this.x += this.xSpeed;
		this.y += this.ySpeed;

	},
	shoot: function() {
		var projectilePosition = this.midpoint();

		playerProjectiles.push(makeProjectile({
			speed: 5,
			x: projectilePosition.x,
			y: projectilePosition.y,
				facing: this.facing
		}, canvas));
	},
	midpoint: function() {
		return {
			x: this.x + this.width/2,
			y: this.y + this.height/2
		};
	}
};

	// this function will do its best to make stuff work at 60FPS - please notice I said "will do its best"
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000/60);
		};
	})();

	function loadCheck() {
		tilesets--;
		if (tilesets === 0) {
			var renderOptions = {
				canvas: canvas,
				context: context,
				levelRows: levelRows,
				levelCols: levelCols,
				levels: levels,
				playerClass: playerClass,
				playerProjectiles: playerProjectiles,
				bgTileset: bgTileset,
				charTileset: charTileset,
				tileSize: tileSize
			};
			renderer = new levelRenderer.Renderer(renderOptions);
			updateGame();
		}
	}

	var tilesets = 2;

	bgTileset = new tileset.Tileset({
			spritePath: '../img/walls.png',
			specPath: '../spec/gaunt.json',
			onReady: loadCheck
	});

	charTileset = new tileset.Tileset({
			spritePath: '../img/animals.gif',
			specPath: '../spec/sprite.json',//TODO
			onReady: loadCheck
	});

	// function to handle the game itself
	function updateGame() {
		// updates player position
		playerClass.update();

		// check for projectiles

		playerProjectiles.forEach(function(projectile) {
			projectile.update();
		});
		playerProjectiles = playerProjectiles.filter(function(projectile) {
			return projectile.active;
		});

		// checks for collisions and positions player accordingly
		var collisionParams = {
			playerClass: playerClass,
			tileSize: tileSize,
			levels: levels
		};

		var exit = collisionManager.collisionDetection(collisionParams);

		if (exit) {
			levels = levelManager.LevelChoice(levels.num += 1);
			renderer.levels = levels;
		}
		// rendering
		renderer.render();

		// update the game in about 1/60 seconds

		requestAnimFrame(function() {
			updateGame();
		});
	}
})();
