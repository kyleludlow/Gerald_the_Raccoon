var utils = require('./utils');
var gameRunning = false;

// show intro screen on page load
document.addEventListener('DOMContentLoaded', function() {
  utils.init();
	$('.play').on('click', setGameCycle); // both intro and death screen have '.play' buttons;
});

// function to start and stop game cycle.
function setGameCycle() {
	$('.intro-screen').fadeOut(500);
	gameRunning = !gameRunning;
	if (gameRunning) {
		startGame();
	}
};

// breaks the start game into a function so it can be triggered when needed.
function startGame() {
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

	// parameters for player
	var playerOptions = {
		playerXPos: playerXPos,
		playerYPos: playerYPos,
		tileSize: tileSize,
		context: context,
	};

  // creates new player and binds key events to it
	var playerClass = new player.Player(playerOptions);
	document.addEventListener("keydown", playerClass.moveStart.bind(playerClass));
	document.addEventListener("keyup", playerClass.moveStop.bind(playerClass));

  // displays current game score on top of page
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
	

	var tilesets = 7;
	// background tileset
	bgTileset = new tileset.Tileset({
			spritePath: './img/walls.png',
			specPath: './spec/gaunt.json',
			onReady: loadCheck
	});

  // tColumn tileset
	tColumnTileset = new tileset.Tileset({
			spritePath: './img/tTiles.png',
			specPath: './spec/tTile.json',
			onReady: loadCheck
	});

	// player tileset
	charTileset = new tileset.Tileset({
			spritePath: './img/animals.gif',
			specPath: './spec/sprite.json',//TODO
			onReady: loadCheck
	});
	// mob tileset
	farmerTileset = new tileset.Tileset({
			spritePath: './img/farmer.png',
			specPath: './spec/farmer.json',
			onReady: loadCheck
	});
	// exit/stair tileset
	stairTileset = new tileset.Tileset({
			spritePath: './img/stairs.png',
			specPath: './spec/sprite.json',
			onReady: loadCheck
	});
	// pickable items tileset
	pickupTileset = new tileset.Tileset({
			spritePath: './img/trash_can.png',
			specPath: './spec/sprite.json',
			onReady: loadCheck
	});
	//door tileset
	doorTileset = new tileset.Tileset({
			spritePath: './img/door.png',
			specPath: './spec/sprite.json',
			onReady: loadCheck
	});

	// function to handle the game itself
	function updateGame() {
		// updates player position
		playerClass.update();

		// check for projectiles and updates position on map
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

    // if player exits level, remove mobs
		if (exit) {
			levels = levelManager.LevelChoice(levels.num + 1);
			renderer.levels = levels;
			renderer.killMobs = true;
		}

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
