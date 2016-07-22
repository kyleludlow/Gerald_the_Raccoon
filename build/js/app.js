(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./collisionManager":2,"./levelManager":3,"./levelRenderer":4,"./projectile":6,"./tileset":7}],2:[function(require,module,exports){
function collisionDetection({playerClass, tileSize, levels}) {

	var baseCol = Math.floor(playerClass.x/tileSize);
	var baseRow = Math.floor(playerClass.y/tileSize);
	var colOverlap = playerClass.x%tileSize;
	var rowOverlap = playerClass.y%tileSize;

    // check for horizontal player collisions

    if(playerClass.xSpeed>0){
        if((levels.map[baseRow][baseCol+1] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow+1][baseCol] && rowOverlap)){
            if (levels.map[baseRow][baseCol + 1] === 10) {
                return true;
            }
            playerClass.x=baseCol*tileSize;
        }
    }

    if(playerClass.xSpeed<0){
        if((!levels.map[baseRow][baseCol+1] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow+1][baseCol] && rowOverlap)){
            console.log("V1 ", levels.map[baseRow][baseCol])
            if (levels.map[baseRow + 1][baseCol] === 10) {
                return true;
            }
            playerClass.x=(baseCol+1)*tileSize;
        }
    }

	// check for vertical player collisions

    if(playerClass.ySpeed>0){
        if((levels.map[baseRow+1][baseCol] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow][baseCol+1] && colOverlap)){
            if (levels.map[baseRow + 1][baseCol] === 10) {
                return true;
            }
            playerClass.y = baseRow*tileSize;
        }
    }

	if(playerClass.ySpeed<0){
		if((!levels.map[baseRow+1][baseCol] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow][baseCol+1] && colOverlap)){
			if (levels.map[baseRow][baseCol] === 10) {
                    return true;
			}
			playerClass.y = (baseRow+1)*tileSize;
		}
	}
};

exports.collisionDetection = collisionDetection;
},{}],3:[function(require,module,exports){
var maps = require('./maps');

var LevelChoice = function(choice) {
    var level = null; 
    switch (choice) {
        case 1:
            level = maps.levels.one;
            break;
        case 2:
            level = maps.levels.two;
            break;
        case 3:
            level = maps.levels.three;
            break;
        case 4:
            level = maps.levels.four;
            break;
        default:
            level = maps.levels.one;
    }
    return level;
};                           

exports.LevelChoice = LevelChoice;


},{"./maps":5}],4:[function(require,module,exports){
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
};

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
    // this.playerClass.draw();
    // this.playerProjectiles.forEach(function(projectile) {
    //     projectile.draw();
    // });
    this.drawTile(this.charTileset.sprite, this.charTileset.tileSpec[1], this.playerClass.x/this.playerClass.width, this.playerClass.y/this.playerClass.height);
};

exports.Renderer = Renderer;

},{"./tileset":7}],5:[function(require,module,exports){
var levels =  {
    one : { // 35 x 19
        num: 1,
        map : 
        [        						
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,10,10,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,10,10,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	    ],
        playerCol: 32,
        playerRow: 17
    },
    two: {
        num: 2,
        map: 
        [        						
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,10,10,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,10,10,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	    ],
        playerCol: 33,
        playerRow: 2
    },
    three: {
        num: 3,
        map: 
        [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,1,0,0,0,0,0,0,0,1,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        playerCol: 33,
        playerRow: 2
    },
    four: {
        num: 4,
        map: 
        [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,0,0,1],
            [1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,10,10,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,10,10,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ]
    }
}

exports.levels = levels;

/*

Templates =======================

35 x 19

[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]


[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
*/
},{}],6:[function(require,module,exports){
// sets projectile direction, draws projectile, updates projectile, contains projectile

	function makeProjectile(I, canvas) {

	  I.active = true;


		I.width = 3;
	  I.height = 3;
	  I.color = "#8A2BE2";

		// adjusts x and y velocity to change projectile direction per facing direction
		switch (I.facing) {
			case 'up':
				I.xVelocity = 0;
				I.yVelocity = -I.speed;
				break;
			case 'right':
				I.xVelocity = I.speed;
				I.yVelocity = 0;
				break;
			case 'down':
				I.xVelocity = 0;
				I.yVelocity = I.speed;
				break;
			case 'left':
				I.xVelocity = -I.speed;
				I.yVelocity = 0;
				break;
			default:
				console.log('projectile aiming broke');
		}

	  I.inBounds = function() {
	    return I.x >= 0 && I.x <= canvas.width &&
	      I.y >= 0 && I.y <= canvas.height;
	  };

	  I.draw = function() {
			var context = canvas.getContext("2d");
	    context.fillStyle = this.color;
	    context.fillRect(this.x, this.y, this.width, this.height);
	  };

	  I.update = function() {
	    I.x += I.xVelocity;
	    I.y += I.yVelocity;

	    I.active = I.active && I.inBounds();
	  };

	  return I;
	};

exports.makeProjectile = makeProjectile;

},{}],7:[function(require,module,exports){
var Tileset = function(options){
	this.onspriteload = options.onspriteload || function(){};
	this.onReadyCb = options.onReady || function(){};
	this.tileSpec = options.tileSpec || {};

	this.sprite = new Image();
	this.sprite.onload = this.onSpriteLoad.bind(this);
	this.spriteLoaded = false;
	this.sprite.src = options.spritePath;

	$.getJSON(options.specPath, this.onSpecLoad.bind(this));
};

Tileset.prototype.onSpriteLoad = function(e){
	this.spriteLoaded = true;
  console.log('sprite loaded', this.sprite);
	this.onReady();
};

Tileset.prototype.onSpecLoad = function(data){
	this.specLoaded = true;
	this.tileSpec = data;
  console.log('spec loaded', this.tileSpec);
	this.onReady();
};

Tileset.prototype.onReady = function(){
	if(this.specLoaded && this.spriteLoaded){
		this.onReadyCb();
	}
};

Tileset.prototype.getSprite = function(){
	return this.sprite;
};

Tileset.prototype.getTileSpec = function(){
	return this.tileSpec;
};

	exports.Tileset = Tileset;

},{}]},{},[1]);
