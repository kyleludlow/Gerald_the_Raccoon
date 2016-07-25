(function(){
	var utils = require('./utils');
	utils.startUp();
	var canvas = document.getElementById("canvas");   // the canvas where game will be drawn
	var context = canvas.getContext("2d");            // canvas context
	var levelRenderer = require('./levelRenderer');
	var renderer = null;
	var levelManager = require('./levelManager');
	var levels = levelManager.LevelChoice(1);

	var tileset = require('./tileset');
	var player = require('./player');

	var collisionManager = require('./collisionManager');

	var levelCols = levels.map[0].length;				// level width, in tiles
	var levelRows = levels.map.length;					// level height, in tiles
	var tileSize = 32;												  // tile size, in pixels
	var playerCol = levels.playerCol;          // player starting column
	var playerRow = levels.playerRow;          // player starting row
	var keyPresses = {
		leftPressed: false,                   // are we pressing LEFT arrow key?
		rightPressed: false,                  // are we pressing RIGHT arrow key?
		upPressed: false,                    // are we pressing UP arrow key?
		downPressed: false,                  // are we pressing DOWN arrow key?
		spacePressed: false,                  // are we pressing space key?
	};

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
				keyPresses.leftPressed = true;
				break;
			case 87:
				keyPresses.upPressed = true;
				break;
			case 68:
				keyPresses.rightPressed = true;
				break;
			case 83:
				keyPresses.downPressed = true;
				break;
			case 32:
				keyPresses.spacePressed = true;
				break;
		}
	}, false);

	document.addEventListener("keyup", function(e) {
		switch(e.keyCode){
			case 65:
				keyPresses.leftPressed = false;
				break;
			case 87:
				keyPresses.upPressed = false;
				break;
			case 68:
				keyPresses.rightPressed = false;
				break;
			case 83:
				keyPresses.downPressed = false;
				break;
			case 32:
				keyPresses.spacePressed = false;
		}
	}, false);

	//creates gerald and makes him shoot stuff

	var playerOptions = {
		keyPresses: keyPresses,
		movementSpeed: movementSpeed,
		playerXPos: playerXPos,
		playerYPos: playerYPos,
		tileSize: tileSize
	};

	var playerClass = new player.Player(playerOptions);
	utils.textWobbler(`Score: ${playerClass.score}`, '.score');
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
				bgTileset: bgTileset,
				charTileset: charTileset,
				stairTileset: stairTileset,
				pickupTileset: pickupTileset,
				tileSize: tileSize
			};
			renderer = new levelRenderer.Renderer(renderOptions);
			updateGame();
		}
	}

	var tilesets = 3;

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

	stairTileset = new tileset.Tileset({
			spritePath: '../img/stairs.png',
			specPath: '../spec/sprite.json',
			onReady: loadCheck
	});

	pickupTileset = new tileset.Tileset({
			spritePath: '../img/trash_can.png',
			specPath: '../spec/sprite.json',
			onReady: loadCheck
	})

	// function to handle the game itself
	function updateGame() {
		// updates player position
		playerClass.update();
		// check for projectiles
		

		playerClass.playerProjectiles.forEach(function(projectile) {
			projectile.update();
		});
		playerClass.playerProjectiles = playerClass.playerProjectiles.filter(function(projectile) {
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
			console.log(levels.num);
			levels = levelManager.LevelChoice(levels.num + 1);
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
