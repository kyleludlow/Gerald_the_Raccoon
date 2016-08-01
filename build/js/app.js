(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('./utils');
var gameRunning = false;

document.addEventListener('DOMContentLoaded', function() {
  utils.init();
	$('.play').on('click', setGameCycle); // both intro and death screen have '.play' buttons;
});

function setGameCycle() { // function to start and stop game cycle.
	$('.intro-screen').fadeOut(500);
	gameRunning = !gameRunning;
	if (gameRunning) {
		startGame();
	}
};

function startGame() { // broke the start game into a function so it can be triggered when needed.
	var canvas = document.getElementById("canvas");   // the canvas where game will be drawn
	var context = canvas.getContext("2d");            // canvas context
	var levelRenderer = require('./levelRenderer');
	var renderer = null;
	var levelManager = require('./levelManager');
	var levels = levelManager.LevelChoice(1);
	var tileset = require('./tileset');
	var player = require('./player');
	var mob = require('./mob');
	var makeProjectile = require('./projectile').makeProjectile;

	var collisionManager = require('./collisionManager');
	var playerCollision = require('./player.collision');
	var projectileCollision = require('./projectile.collision');

	var levelCols = levels.map[0].length;				// level width, in tiles
	var levelRows = levels.map.length;					// level height, in tiles
	var tileSize = 32;												  // tile size, in pixels
	var playerCol = levels.playerCol;          // player starting column
	var playerRow = levels.playerRow;          // player starting row

	var playerYPos = playerRow * tileSize;		// converting Y player position from tiles to pixels
	var playerXPos = playerCol * tileSize;   // converting X player position from tiles to pixels

	canvas.width = tileSize * levelCols;   // canvas width. Won't work without it even if you style it from CSS
	canvas.height = tileSize * levelRows;  // canvas height. Same as before

	// player stuff
	var playerOptions = {
		playerXPos: playerXPos,
		playerYPos: playerYPos,
		tileSize: tileSize,
		context: context,
	};

	var playerClass = new player.Player(playerOptions);
	document.addEventListener("keydown", playerClass.moveStart.bind(playerClass));
	document.addEventListener("keyup", playerClass.moveStop.bind(playerClass));

	utils.textWobbler(`Score: ${playerClass.score}`, '.score');

	// this function will do its best to make stuff work at 60FPS - please notice I said "will do its best"
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000/60);
		};
	})();

	// makes sure that all tilesets have been loaded before
	// updating the game

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
				bgTileset: bgTileset,
				charTileset: charTileset,
				farmerTileset: farmerTileset,
				stairTileset: stairTileset,
				pickupTileset: pickupTileset,
				doorTileset: doorTileset,
        tColumnTileset: tColumnTileset,
				tileSize: tileSize
			};
			renderer = new levelRenderer.Renderer(renderOptions);
			updateGame();
		}
	};


	$.getJSON('spec/farmer.json', function(data) {
    var farmerSpec = data || '../spec/farmer.json'
  })
	

	var tilesets = 7;
	// background tileset
	bgTileset = new tileset.Tileset({
			spritePath: '../img/walls.png',
			specPath: '../spec/gaunt.json',
			onReady: loadCheck
	});

  // tColumn tileset
	tColumnTileset = new tileset.Tileset({
			spritePath: '../img/tTiles.png',
			specPath: '../spec/tTile.json',
			onReady: loadCheck
	});

	// player tileset
	charTileset = new tileset.Tileset({
			spritePath: '../img/animals.gif',
			specPath: '../spec/sprite.json',//TODO
			onReady: loadCheck
	});
	// mob tileset
	farmerTileset = new tileset.Tileset({
			spritePath: '../img/farmer.png',
			specPath: farmerSpec,
			onReady: loadCheck
	});
	// exit/stair tileset
	stairTileset = new tileset.Tileset({
			spritePath: '../img/stairs.png',
			specPath: '../spec/sprite.json',
			onReady: loadCheck
	});
	// pickable items tileset
	pickupTileset = new tileset.Tileset({
			spritePath: '../img/trash_can.png',
			specPath: '../spec/sprite.json',
			onReady: loadCheck
	});
	//door tileset
	doorTileset = new tileset.Tileset({
			spritePath: '../img/door.png',
			specPath: '../spec/sprite.json',
			onReady: loadCheck
	});

	// function to handle the game itself
	function updateGame() {
		// updates player position
		playerClass.update();

		// updates mob position and has it move toward player
		// mobClass.chooseAction();

		// check for projectiles
		playerClass.playerProjectiles.forEach(function(projectile) {
			projectile.update();
		});
		playerClass.playerProjectiles = playerClass.playerProjectiles.filter(function(projectile) {
			return projectile.active;
		});

		// checks for collisions and positions player accordingly
		var collisionParams = {
			entity: playerClass,
			tileSize: tileSize,
			levels: levels
		};

		// checks for when player reaches exit/stairs
		var exit = playerCollision.playerCollision(collisionParams);

		if (exit) {
			levels = levelManager.LevelChoice(levels.num + 1);
			renderer.levels = levels;
			renderer.killMobs = true;
			// mobClass.updateMap();
		}

		// checks the collisions for the mob
		// collisionParams.playerClass = mobClass;

		// collisionManager.collisionDetection(collisionParams);

		// rendering
		renderer.render(levels, tileSize);

		// update the game in about 1/60 seconds
		if (gameRunning) {
			requestAnimFrame(function() {
				updateGame();
			});
		}
	}
};

exports.startGame = startGame;
exports.setGameCycle = setGameCycle;

},{"./collisionManager":2,"./levelManager":3,"./levelRenderer":4,"./mob":7,"./player":9,"./player.collision":8,"./projectile":11,"./projectile.collision":10,"./tileset":12,"./utils":13}],2:[function(require,module,exports){
function collisionDetection(options, collisionHandlers) {
    var entity = options.entity;
    var tileSize = options.tileSize;
    var levels = options.levels;
    var baseCol = Math.floor(entity.x / tileSize);
    var baseRow = Math.floor(entity.y / tileSize);
    var colOverlap = entity.x % tileSize;
    var rowOverlap = entity.y % tileSize;

		// defines entity specific collision handlers to be updated by entity
    this.collidesLeft = collisionHandlers.collidesLeft;
    this.collidesRight = collisionHandlers.collidesRight;
    this.collidesAbove = collisionHandlers.collidesAbove;
    this.collidesBelow = collisionHandlers.collidesBelow;

		// handles wall collision and entity-specific collision events
    this.handleCollisions = function() {
        var reachedExit = false;
        // check for right collisions
        if (entity.xSpeed > 0) {
            if ((levels.map[baseRow][baseCol + 1] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow + 1][baseCol + 1] && !levels.map[baseRow + 1][baseCol] && rowOverlap)) {
								// positions entity along side of the wall
                entity.x = baseCol * tileSize;
            }
            // checks for non-wall collision events and returns accordingly (see entity collisions)
            if (this.collidesRight(levels, entity, baseRow, baseCol)) {
              reachedExit = true;
            }
        }

				// checks for left collisions
        if (entity.xSpeed < 0) {
            if ((!levels.map[baseRow][baseCol + 1] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow + 1][baseCol + 1] && levels.map[baseRow + 1][baseCol] && rowOverlap)) {
								// positions entity along side of the wall
                entity.x = (baseCol + 1) * tileSize;
            }
            // checks for non-wall collision events and returns accordingly (see entity collisions)
            if (this.collidesLeft(levels, entity, baseRow, baseCol)) {
              reachedExit = true;
            }
        }

				// check for below entity collisions
        if (entity.ySpeed > 0) {
            if ((levels.map[baseRow + 1][baseCol] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow + 1][baseCol + 1] && !levels.map[baseRow][baseCol + 1] && colOverlap)) {
								// positions entity along side of the wall
								entity.y = baseRow * tileSize;
            }
            // checks for non-wall collision events and returns accordingly (see entity collisions)
            if (this.collidesBelow(levels, entity, baseRow, baseCol)) {
              reachedExit = true;
            }
        }

				// check for above entity collisions
        if (entity.ySpeed < 0) {
            if ((!levels.map[baseRow + 1][baseCol] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow + 1][baseCol + 1] && levels.map[baseRow][baseCol + 1] && colOverlap)) {
								// positions entity along side of the wall
                entity.y = (baseRow + 1) * tileSize;
            }
            // checks for non-wall collision events and returns accordingly (see entity collisions)
            if (this.collidesAbove(levels, entity, baseRow, baseCol)) {
              reachedExit = true;
            }
        }
        return reachedExit;
    }
		return this.handleCollisions();
};

exports.collisionDetection = collisionDetection;

},{}],3:[function(require,module,exports){
var maps = require('./maps');

// function to send the correct map to the renderer.

var LevelChoice = function(choice) {
    var level = null;
    switch (choice) {
        case 1:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.one.map)), // deep clone of original map. Otherwise pickups are not rerendered wen the level comes around again.
                num: maps.levels.one.num, // used by level manager to know what the next level will be
                playerCol: maps.levels.one.playerCol,
                playerRow: maps.levels.one.playerRow
            }
            break;
        case 2:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.two.map)),
                num: maps.levels.two.num,
                playerCol: maps.levels.two.playerCol,
                playerRow: maps.levels.two.playerRow
            }
            break;
        case 3:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.three.map)),
                num: maps.levels.three.num,
                playerCol: maps.levels.three.playerCol,
                playerRow: maps.levels.three.playerRow
            }
            break;
        case 4:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.four.map)),
                num: maps.levels.four.num,
                playerCol: maps.levels.four.playerCol,
                playerRow: maps.levels.four.playerRow
            }
            break;
        case 5:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.five.map)),
                num: maps.levels.five.num,
                playerCol: maps.levels.five.playerCol,
                playerRow: maps.levels.five.playerRow
            }
            break;
        case 6:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.six.map)),
                num: maps.levels.six.num,
                playerCol: maps.levels.six.playerCol,
                playerRow: maps.levels.six.playerRow
            }
            break;
        default:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.one.map)),
                num: maps.levels.one.num,
                playerCol: maps.levels.one.playerCol,
                playerRow: maps.levels.one.playerRow
            }
    }
    return level;
};

exports.LevelChoice = LevelChoice;

},{"./maps":5}],4:[function(require,module,exports){
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
  this.tColumnTileset = options.tColumnTileset;
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
      if (this.levels.map[i][j] !== 0 && this.levels.map[i][j] < 2) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[this.levels.map[i][j]], j, i);
      }
      else if (this.levels.map[i][j] === 7) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[4], j, i);
      }
      else if (this.levels.map[i][j] === 2) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[2], j, i);
      }
      else if (this.levels.map[i][j] === 11) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[6], j, i);
      }
      else if (this.levels.map[i][j] === 10) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[7], j, i);
      }
      else if (this.levels.map[i][j] === 6) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[3], j, i);
      }
      else if (this.levels.map[i][j] === 8) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[5], j, i);
      }
      else if (this.levels.map[i][j] === 12) {
        this.drawTile(this.bgTileset.sprite, this.bgTileset.tileSpec[8], j, i);
      }
      // t columns
      else if (this.levels.map[i][j] === 13) {
        this.drawTile(this.tColumnTileset.sprite, this.tColumnTileset.tileSpec[3], j, i);
      }
      else if (this.levels.map[i][j] === 14) {
        this.drawTile(this.tColumnTileset.sprite, this.tColumnTileset.tileSpec[1], j, i);
      }
      else if (this.levels.map[i][j] === 15) {
        this.drawTile(this.tColumnTileset.sprite, this.tColumnTileset.tileSpec[2], j, i);
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

},{"./mob":7,"./mob.collision":6,"./projectile.collision":10}],5:[function(require,module,exports){
/*

each map is a 2d array. Current standard size is 35 x 19.

reference points:
    0: walkable / floor / transparent.
    1: block
    2: bottom-left corner
    3: exit
    4: trashcan pickup
    5: door sprite
    6: bottom-right corner
    7: top-left corner
    8: top-right corner
    9: enemy spawn point
    10: horizontal column
    11: vertical column
    12: T column

*/

// NOT YET IN PLACE--TODO
// T column right -- 13
// T column upside down -- 14
// T column left -- 15

var levels =  {
    one : {
        num: 1, // used by levelManager to define the next level.
        map :
        [
            [7,10,12,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,8],
            [11,3,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11],
            [11,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,10,10,11],
            [11,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,9,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,5,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [2,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,6]
	    ],
        playerCol: 32, // this is only used in the initial level. It seems to be ignored every subsequent render.
        playerRow: 17
    },
    two: {
        num: 2,
        map:
        [
            [7,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,8],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,5,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,10,10,10,10,10,10,10,10,10,10,10,10,10,10,0,0,0,0,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,11,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,11,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,11,0,11],
            [11,0,11,0,0,0,9,0,0,0,0,0,0,11,0,0,0,10,10,10,11,0,0,0,0,0,0,0,9,0,0,0,11,0,11],
            [11,4,11,0,0,0,5,0,0,0,0,0,0,11,0,0,0,0,0,4,11,0,0,0,0,0,0,0,5,0,0,0,11,3,11],
            [2,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,6]
	    ],
        playerCol: 33,
        playerRow: 2
    },
    three: {
        num: 3,
        map:
        [
            [7,10,10,10,10,10,10,10,10,10,10,10,12,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,8],
            [11,0,0,0,0,0,0,0,0,0,0,4,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,10,10,10,10,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,0,2,10,10,10,10,10,10,10,8,0,0,0,10,10,10,10,8,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,2,10,10,10,10,10,10,10,10,8,0,11,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,7,10,8,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,11,4,11,0,0,0,0,0,11,0,0,11],
            [11,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,11,0,11,0,11,0,11,0,0,0,0,9,11,0,0,11],
            [11,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,11,4,11,3,11,0,0,0,0,0,0,5,11,0,0,11],
            [2,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,6]
        ],
        playerCol: 33,
        playerRow: 2
    },
    four: {
        num: 4,
        map:
        [
            [7,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,8],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,10,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,7,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,8,0,0,11],
            [11,0,0,0,11,5,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,11,0,0,10,10,10,10,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,11,0,0,0,0,0,4,11,0,0,0,0,0,0,0,0,7,10,10,10,10,10,10,10,0,0,0,11,0,0,11],
            [11,0,0,0,2,10,10,10,10,10,10,6,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,11,0,0,0,0,0,0,0,0,0,0,11,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,11,0,0,0,0,0,0,0,0,0,0,11,0,3,11],
            [2,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,6]
        ],
        playerCol: 33,
        playerRow: 2
    },
    five: {
        num: 5,
        map:
        [
            [7,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,12,10,8],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,4,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11],
            [11,5,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,10,10,10,10,10,10,8,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,7,10,10,8,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11,5,9,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,10,12,10,10,10,8,0,0,0,0,0,0,0,0,0,11,3,11,0,0,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,4,11,0,5,0,11,0,0,0,0,0,0,0,0,0,2,10,6,0,0,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,11,0,9,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,11,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,11,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,10,10,10,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,4,11,0,0,0,0,0,0,0,0,0,0,11],
            [2,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,6]
        ],
        playerCol: 33,
        playerRow: 2
    },
    six: {
        num: 6,
        map:
        [
            [7,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,8],
            [11,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,5,11],
            [11,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,5,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,7,10,10,10,10,10,10,10,10,12,10,8,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,4,11,5,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,7,10,10,10,10,10,10,11,9,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,11,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,2,10,10,0,0,10,10,6,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,2,10,10,10,10,0,0,0,7,10,10,6,0,0,0,0,0,0,0,0,11,0,11],
            [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,11,0,11],
            [11,10,10,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,11,0,11],
            [11,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,4,0,0,0,0,0,0,0,0,0,0,11,3,11],
            [2,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,6]
        ],
        playerCol: 3,
        playerRow: 3
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
var collisionManager = require('./collisionManager').collisionDetection;

// defines object for mob specific collision events
var mobCollisions = {};

// handles mob non-wall right collision events
mobCollisions.collidesRight = function(levels, entity, baseRow, baseCol) {
    return;
};

// handles mob non-wall left collision events
mobCollisions.collidesLeft = function(levels, entity, baseRow, baseCol) {
    return;
};

// handles mob non-wall below collision events
mobCollisions.collidesBelow = function(levels, entity, baseRow, baseCol) {
    return;
};

// handles mob non-wall above collision events
mobCollisions.collidesAbove = function(levels, entity, baseRow, baseCol) {
    return;
};

// calls the collision manager with mob specific collision event handlers
var mobCollision = function(options) {
    return collisionManager(options, mobCollisions);
};

exports.mobCollision = mobCollision;

},{"./collisionManager":2}],7:[function(require,module,exports){
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

},{"../lib/astar":14,"./app.js":1}],8:[function(require,module,exports){
var collisionManager = require('./collisionManager').collisionDetection;
var utils = require('./utils');

// defines object for player specific collision events
var playerCollisions = {};

// handles player non-wall right collision events
playerCollisions.collidesRight = function(levels, entity, baseRow, baseCol) {
    // if the tile to the right is a staircase, return true for level handling
    if (levels.map[baseRow][baseCol + 1] === 3) {
        return true;
    }
    // else if the tile to the right is a trashcan, player score increased and trashcan removed
    else if (levels.map[baseRow][baseCol + 1] === 4) {
        entity.score += 1;
        utils.textWobbler(`Score: ${entity.score}`, '.score');
        levels.map[baseRow][baseCol + 1] = 0;
    }
    return false;
};

// handles player non-wall left collision events
playerCollisions.collidesLeft = function(levels, entity, baseRow, baseCol) {
    // if the tile to the left is a staircase, return true for level handling
    if (levels.map[baseRow + 1][baseCol] === 3) {
        return true;
    }
    // else if the tile to the left is a trashcan, player score increased and trashcan removed
    else if (levels.map[baseRow + 1][baseCol] === 4) {
        entity.score += 1;
        utils.textWobbler(`Score: ${entity.score}`, '.score');
        levels.map[baseRow + 1][baseCol] = 0;
    }
    return false;
};

// handles player non-wall below collision events
playerCollisions.collidesBelow = function(levels, entity, baseRow, baseCol) {
    // if the tile below is a staircase, return true for level handling
    if (levels.map[baseRow + 1][baseCol] === 3) {
        return true;
    }
    // else if the tile below is a trashcan, player score increased and trashcan removed
    else if (levels.map[baseRow + 1][baseCol] === 4) {
        entity.score += 1;
        utils.textWobbler(`Score: ${entity.score}`, '.score');
        levels.map[baseRow + 1][baseCol] = 0;
    }
    return false;
};

// handles player non-wall above collision events
playerCollisions.collidesAbove = function(levels, entity, baseRow, baseCol) {
    // if the tile above is a staircase, return true for level handling
    if (levels.map[baseRow][baseCol] === 3) {
        return true;
    }
    // else if the tile above is a trashcan, player score increased and trashcan removed
    else if (levels.map[baseRow][baseCol] === 4) {
        entity.score += 1;
        utils.textWobbler(`Score: ${entity.score}`, '.score');
        levels.map[baseRow][baseCol] = 0;
    }
    return false;
};

// calls the collision manager with player specific collision event handlers
var playerCollision = function(options) {
    return collisionManager(options, playerCollisions);
};

exports.playerCollision = playerCollision;

},{"./collisionManager":2,"./utils":13}],9:[function(require,module,exports){
var makeProjectile = require('./projectile').makeProjectile;

var Player = function(options) {
  this.context = options.context;
  this.sprite = new Image();
  this.tileSize = options.tileSize;
  this.playerProjectiles = [];    // shot projectiles array
  this.keyPresses = {             // are hotkeys being pressed?
		leftPressed: false,
		rightPressed: false,
		upPressed: false,
		downPressed: false,
		spacePressed: false,
	};
  this.movementSpeed = 5;
  this.x = options.playerXPos;    // player x coordinate on map
  this.y = options.playerYPos;    // player y coordinate on map
  this.width = options.tileSize;  // player width
  this.height = options.tileSize; // player height
  this.xSpeed = 0;                // horizontal speed
  this.ySpeed = 0;                // vertical speed
  this.facing = 'up';             // facing direction
  this.score = 0;                 // current game score
  this.now = Date.now();          // current timestamp to help limit fire rate
};

//draws player
Player.prototype.draw = function() {
  var singleTileSpec;

  switch (this.facing) {
		case 'up':
			this.sprite.src = './img/PonAndCon-backwards.png';
      singleTileSpec = {
        x: 0,
        y: 0
      };
			break;
		case 'left':
			this.sprite.src = './img/PonAndCon.gif';
      singleTileSpec = {
        x: 32,
        y: 0
      };
			break;
		case 'down':
			this.sprite.src = './img/animals.gif';
      singleTileSpec = {
        x: 0,
        y: 0
      };
			break;
		case 'right':
			this.sprite.src = './img/PonAndConReverse.gif';
      singleTileSpec = {
        x: 32,
        y: 0
      };
			break;
	}
  this.context.drawImage(
		this.sprite,
		singleTileSpec.x, singleTileSpec.y, this.tileSize, this.tileSize,
		Math.floor(this.x), Math.floor(this.y), this.tileSize, this.tileSize
	);
};

// updates player speed, position, and shooting
Player.prototype.update = function() {
  this.xSpeed = 0;
  this.ySpeed = 0;

  //shoot projectile if space pressed and limit fire rate.
  if (this.keyPresses.spacePressed && Date.now() - this.now > 150) {
    this.shoot();
    this.now = Date.now();
  }

  //updates speed according to pressed key
  if (this.keyPresses.rightPressed) {
    this.xSpeed = this.movementSpeed;
    this.facing = 'right';
  }
  else {
    if (this.keyPresses.leftPressed) {
      this.xSpeed = -(this.movementSpeed);
      this.facing = 'left';
    }
    else {
      if (this.keyPresses.upPressed) {
        this.ySpeed = -(this.movementSpeed);
        this.facing = 'up';
      }
      else {
        if (this.keyPresses.downPressed) {
          this.ySpeed = this.movementSpeed;
          this.facing = 'down';
        }
      }
    }
  }
  this.x += this.xSpeed;
  this.y += this.ySpeed;
};

// sends projectile options to factory for rendering
Player.prototype.shoot = function() {
  var projectilePosition = this.midpoint();

  var projectile = makeProjectile({
    speed: 8,
    x: projectilePosition.x,
    y: projectilePosition.y,
    facing: this.facing
  }, canvas);
  this.playerProjectiles.push(projectile);
};

// calculates the player middle for projectile starting location
Player.prototype.midpoint = function() {
  return {
    x: this.x + this.width/2,
    y: this.y + this.height/2
  };
};

// stores movement and projectile hotkey keydowns
Player.prototype.moveStart = function(e) {
  switch(e.keyCode) {
			case 65:
				this.keyPresses.leftPressed = true;
        break;
			case 87:
				this.keyPresses.upPressed = true;
				break;
			case 68:
				this.keyPresses.rightPressed = true;
				break;
			case 83:
				this.keyPresses.downPressed = true;
				break;
			case 32:
				this.keyPresses.spacePressed = true;
				break;
	};
};

// stores movement and projectile hotkey keyups
Player.prototype.moveStop = function(e) {
  switch(e.keyCode){
			case 65:
				this.keyPresses.leftPressed = false;
				break;
			case 87:
				this.keyPresses.upPressed = false;
				break;
			case 68:
				this.keyPresses.rightPressed = false;
				break;
			case 83:
				this.keyPresses.downPressed = false;
				break;
			case 32:
				this.keyPresses.spacePressed = false;
	};
};

exports.Player = Player;

},{"./projectile":11}],10:[function(require,module,exports){
function projectileCollision({projectile, mobs, tileSize}, levels) {

	var baseCol = Math.floor(projectile.x/tileSize);
	var baseRow = Math.floor(projectile.y/tileSize);

		// check for projectile collisions with mob
		var hitMob = false;
		if (mobs) {
			mobs.forEach(function(mob) {
				if ((Math.abs(projectile.x - mob.x) < 32) && (Math.abs(projectile.y - mob.y) < 32)) {
					mob.explode();
					hitMob = true;
				}
			});
		}

		if(projectile.xVelocity>0){
        if(hitMob === true || (levels.map[baseRow][baseCol+1] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow+1][baseCol])){
            projectile.image.src = './img/fireball_die_right.png';
            projectile.width = 64;
            projectile.height = 64;
            projectile.y -= 5;
            projectile.x=baseCol*tileSize;
            setTimeout(() => { projectile.active = false }, 100) ;
        }
    }

    if(projectile.xVelocity<0){
        if(hitMob === true || (!levels.map[baseRow][baseCol+1] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow+1][baseCol])){
            projectile.image.src = './img/fireball_die_left.png';
            projectile.width = 64;
            projectile.height = 64;
            projectile.y -= 5;
            projectile.x=(baseCol+1)*tileSize;
            setTimeout(() => { projectile.active = false }, 100);
        }
    }

	// check for vertical projectile collisions
    if(projectile.yVelocity>0){
        if(hitMob === true || (levels.map[baseRow+1][baseCol] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow][baseCol+1])){
            projectile.image.src = './img/fireball_die_down.png';
            projectile.width = 64;
            projectile.height = 64;
            projectile.x -= 2;
            projectile.y = baseRow*tileSize;
            setTimeout(() => { projectile.active = false }, 100);
        }
    }

	if(projectile.yVelocity<0){
		if(hitMob === true || (!levels.map[baseRow+1][baseCol] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow][baseCol+1])){
            projectile.image.src = './img/fireball_die_up.png';
            projectile.width = 64;
            projectile.height = 64;
            projectile.x -= 3;
			projectile.y = (baseRow+1)*tileSize;
            setTimeout(() => { projectile.active = false }, 100);
		}
	}
};

exports.projectileCollision = projectileCollision;

},{}],11:[function(require,module,exports){
// sets projectile direction, draws projectile, updates projectile, contains projectile
function makeProjectile(I, canvas) {

  I.active = true;
	I.image = new Image();
	var lastFire;

	// adjusts x and y velocity to change projectile direction per facing direction
  // also changes fireball sprite and dimensions accordingly
  switch (I.facing) {
		case 'up':
			I.xVelocity = 0;
			I.yVelocity = -I.speed;
			I.width = 30;
  		I.height = 64;
			I.image.src = './img/fireball_up.png';
			break;
		case 'right':
			I.xVelocity = I.speed;
			I.yVelocity = 0;
			I.width = 64;
  		I.height = 30;
			I.image.src = './img/fireball_right.png';
			break;
		case 'down':
			I.xVelocity = 0;
			I.yVelocity = I.speed;
			I.width = 30;
			I.height = 64;
			I.image.src = './img/fireball_down.png';
			break;
		case 'left':
			I.xVelocity = -I.speed;
			I.yVelocity = 0;
			I.width = 64;
  		I.height = 30;
			I.image.src = './img/fireball.gif';
			break;
		default:
			console.log('projectile aiming broke');
	}

  // draws projectile sprite to map
  I.draw = function() {
    if (I.active) {
      var context = canvas.getContext("2d");
  		context.drawImage(I.image, I.x - 25, I.y - 15, this.width, this.height);
    }
  };

  // updates projectile x and y coordinates on map
  I.update = function() {
    if (I.active) {
      I.x += I.xVelocity;
      I.y += I.yVelocity;
    }
  };
  return I;
};

exports.makeProjectile = makeProjectile;

},{}],12:[function(require,module,exports){
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
	this.onReady();
};

Tileset.prototype.onSpecLoad = function(data){
	this.specLoaded = true;
	this.tileSpec = data;
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

},{}],13:[function(require,module,exports){
var game = require('./app');

// init function to enable hiding of intro screen and anything else needed on startup.
var init = function() {
  resizeIntro(); // make sure intro screen fills the viewport...
  textWobbler('Gerald The Raccoon', '.intro-wrapper h1');
  textWobbler('Play Again?', '.death button');
  preload([
    'img/animals.gif',
    'img/door.png',
    'img/farmer.png',
    'img/farmerDown.png',
    'img/farmerLeft.png',
    'img/farmerUp.png',
    'img/farmerRight.png',
    'img/fireball.gif',
    'img/fireball_die_down.png',
    'img/fireball_die_left.png',
    'img/fireball_die_right.png',
    'img/fireball_die_up.png',
    'img/leftFacingT.png',
    'img/PonAndCon.gif',
    'img/PonAndCon-backwards.png',
    'img/PonAndConReverse.gif',
    'img/rightFacingT.png',
    'img/stairs.png',
    'img/trash_can.png',
    'img/tTiles.png',
    'img/upsideDownT.png',
    'img/walls.png'
  ]);
  
  $(window).on('resize', function() {
    resizeIntro();
  })
};

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

// broke wobbly text idea into function so it can be used across the app.
function textWobbler(text, el) {
  var el = document.querySelector(el); // find the required element in the page.
  var output = document.createElement('span'); // create a span to export
  for (var i = 0; i < text.length; i++) { // loop over each letter in the given sentence
    var span = document.createElement('span'); // create a span for each letter
    var letter = document.createTextNode(text[i]); // create a text node out of the given letter.
    span.classList = 'wobble'; // add the wobble class to the span....
    span.appendChild(letter); // ...and put the letter inside it.
    if (span.textContent === " ") {
      span.style.padding = "0.3em"; // spaces were being ignored, so if it is a space give the span padding as an illusion of a space
    }
    span.style.animationDuration = (Math.random() * (1.5 - 0.5 + 1) + 0.5) + 's'; // add a random animation duration so every letter wobbles at a different speed
    output.appendChild(span); // put the new wobbly sentence in the main span to export.
  }
  el.textContent = ''; // clear out the original element text, if any.
  el.appendChild(output); // put the whole lot into the given doc element.
}

function resizeIntro() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  $('.intro-screen').css({'width' : width + "px", 'height': height + "px"});
  $('.death-wrapper').css({'width' : width + "px", 'height': height + "px"});
}

exports.init = init;
exports.textWobbler = textWobbler;
},{"./app":1}],14:[function(require,module,exports){
/**
* AStarFloodFill
* Fork of Matthew Trost's A-Star Pathfinding Algorithm by D Neame @cham
* Adds delayed flood filling support
*
* @license Creative Commons Attribution-ShareAlike 3.0 Unported License
* @datepublished December 2010
*/


/**

map format 2D Array:
	u = unwalkable, w = walkable, s = start , g = goal
	if map is not sane (no u,w,s and g) then does not fail gracefully
	map format e.g.:
	[ ["u", "u", "u", "u", "u"],
	["w", "w", "w", "w", "g"],
	["w", "w", "u", "w", "w"],
	["s", "w", "u", "w", "w"],
	["u", "u", "u", "w", "w"] ]


Following are set in the returned object:

heuristic
	"manhattan" – the speedy Manhattan method, which adds up the x and y distance
	"diagonal" – uses a diagonal line, plus any remaining x/y distance
	"euclidean" – The familiar, elementary distance formula, accurate but slow

cutCorners
	The cutCorners parameter, which accepts a Boolean argument, specifies whether the path can include any diagonal steps – including steps between two unwalkable nodes situated diagonally:
	true – corners may be cut (i.e., diagonal movement is allowed)
	false – corners may not be cut

**/
module.exports = (function(){
	'use strict';

	/*
	 * original astar source
	 */
	function astar (map, heuristic, cutCorners) {
		var listOpen = [];
		var listClosed = [];
		var listPath = [];
		var nodeGoal = createTerminalNode(map, heuristic, "g", null);
		var nodeStart = createTerminalNode(map, heuristic, "s", nodeGoal);
		addNodeToList(nodeStart, listOpen);

		var n;
		while (!isListEmpty(listOpen)) {
			n = returnNodeWithLowestFScore(listOpen);
			addNodeToList(n, listClosed);
			removeNodeFromList(n, listOpen);
			if (areNodesEqual(n, nodeGoal)) {
				pathTo(n, listPath);
				listPath.reverse();
				return listPath;
			}
			n.makeChildNodes(map, heuristic, cutCorners, nodeGoal);
			cullUnwantedNodes(n.childNodes, listOpen);
			cullUnwantedNodes(n.childNodes, listClosed);
			removeMatchingNodes(n.childNodes, listOpen);
			removeMatchingNodes(n.childNodes, listClosed);
			addListToList(n.childNodes, listOpen);
		}
		return null;
	}

	function pathTo (n, listPath) {
		listPath.push(new NodeCoordinate(n.row, n.col));
		if (n.parentNode == null)
			return;
		pathTo(n.parentNode, listPath);
	}

	function addListToList(listA, listB) {
		var x;
		for (x in listA)
			listB.push(listA[x]);
	}

	function removeMatchingNodes (listToCheck, listToClean) {
		var listToCheckLength = listToCheck.length;
		for (var i = 0; i < listToCheckLength; i++) {
			for (var j = 0; j < listToClean.length; j++) {
				if (listToClean[j].row == listToCheck[i].row && listToClean[j].col == listToCheck[i].col)
					listToClean.splice(j, 1);
			}
		}
	}

	function cullUnwantedNodes (listToCull, listToCompare) {
		var listToCompareLength = listToCompare.length;
		for (var i = 0; i < listToCompareLength; i++) {
			for (var j = 0; j < listToCull.length; j++) {
				if (listToCull[j].row == listToCompare[i].row && listToCull[j].col == listToCompare[i].col) {
					if (listToCull[j].f >= listToCompare[i].f)
						listToCull.splice(j, 1);
				}
			}
		}
	}

	function areNodesEqual (nodeA, nodeB) {
		if (nodeA.row == nodeB.row && nodeA.col == nodeB.col)
			return true;
		else
			return false;
	}

	function returnNodeWithLowestFScore (list) {
		var lowestNode = list[0], x;
		for (x in list)
			lowestNode = (list[x].f < lowestNode.f) ? list[x] : lowestNode;
		return lowestNode;
	}

	function isListEmpty (list) {
		return (list.length < 1) ? true : false;
	}

	function removeNodeFromList (node, list) {
		var listLength = list.length;
		for (var i = 0; i < listLength; i++) {
			if (node.row == list[i].row && node.col == list[i].col) {
				list.splice(i, 1);
				break;
			}
		}
	}

	function addNodeToList (node, list) {
		list.push(node);
	}

	function createTerminalNode (map, heuristic, nodeType, nodeGoal) {
		var mapRows = map.length;
		var mapCols = map[0].length;
		for (var row = 0; row < mapRows; row++) {
			for (var col = 0; col < mapCols; col++) {
				if (map[row][col] == nodeType) {
					return new Node(row, col, map, heuristic, null, nodeGoal);
				}
			}
		}
		return null;
	}

	function returnHScore (node, heuristic, nodeGoal) {
		var y = Math.abs(node.row - nodeGoal.row);
		var x = Math.abs(node.col - nodeGoal.col);
		switch (heuristic) {
			case "manhattan":
				return (y + x) * 10;
			case "diagonal":
				return (x > y) ? (y * 14) + 10 * (x - y) : (x * 14) + 10 * (y - x);
			case "euclidean":
				return Math.sqrt((x * x) + (y * y));
			default:
				return null;
		}
	}

	function NodeCoordinate (row, col) {
		this.row = row;
		this.col = col;
	}

	function Node (row, col, map, heuristic, parentNode, nodeGoal) {
		var mapLength = map.length;
		var mapRowLength = map[0].length;
		this.row = row;
		this.col = col;
		this.northAmbit = (row == 0) ? 0 : row - 1;
		this.southAmbit = (row == mapLength - 1) ? mapLength - 1 : row + 1;
		this.westAmbit = (col == 0) ? 0 : col - 1;
		this.eastAmbit = (col == mapRowLength - 1) ? mapRowLength - 1 : col + 1;
		this.parentNode = parentNode;
		this.childNodes = [];

		if (parentNode != null) {
			if (row == parentNode.row || col == parentNode.col)
				this.g = parentNode.g + 10;
			else
				this.g = parentNode.g + 14;
			this.h = returnHScore(this, heuristic, nodeGoal);
		}
		else {
			this.g = 0;
			if (map[row][col] == "s")
				this.h = returnHScore(this, heuristic, nodeGoal);
			else
				this.h = 0;
		}
		this.f = this.g + this.h;

		this.makeChildNodes = function (map, heuristic, cutCorners, nodeGoal) {
			for (var i = this.northAmbit; i <= this.southAmbit; i++) {
				for (var j = this.westAmbit; j <= this.eastAmbit; j++) {
					if (i != this.row || j != this.col) {
						if (map[i][j] != "u") {
							if (cutCorners == true)
								this.childNodes.push(new Node(i, j, map, heuristic, this, nodeGoal));
							else {
								if (i == this.row || j == this.col)
									this.childNodes.push(new Node(i, j, map, heuristic, this, nodeGoal));
							}
						}
					}
				}
			}
		};
	}

	function spiral(size,outwards){
		var i, k, j=0,ret=[],
			pushFn = outwards ?	function(a,b){ a.unshift(b); } :
								function(a,b){ a.push(b); };
		for(i = size; i >=0; i--){
			for(k=j; k < i; k++){
				pushFn(ret,{x:j,y:k});
			}
			for(k=j; k < i; k++) {
				pushFn(ret,{x:k,y:i});
			}
			for(k=i; k > j; k--){
				pushFn(ret,{x:i,y:k});
			}
			for(k=i; k > j; k--){
				pushFn(ret,{x:k,y:j});
			}
			j++;
		}
		return ret;
	}

	return astar;

})();

},{}]},{},[1]);
