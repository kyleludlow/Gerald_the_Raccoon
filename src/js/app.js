(function(){
	var utils = require('./utils');
	utils.init();
	var canvas = document.getElementById("canvas");   // the canvas where game will be drawn
	var context = canvas.getContext("2d");            // canvas context
	var levelRenderer = require('./levelRenderer');
	var renderer = null;
	var levelManager = require('./levelManager');
	var levels = levelManager.LevelChoice(1);

	var tileset = require('./tileset');
	var player = require('./player');
	var mob = require('./mob');

	var collisionManager = require('./collisionManager');
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

	var makeProjectile = require('./projectile').makeProjectile;

	var playerOptions = {
		playerXPos: playerXPos,
		playerYPos: playerYPos,
		tileSize: tileSize
	};

	var playerClass = new player.Player(playerOptions);
	document.addEventListener("keydown", playerClass.moveStart.bind(playerClass));
	document.addEventListener("keyup", playerClass.moveStop.bind(playerClass));

	//mob stuff
	var mobOptions = {
		x: 32,
		y: 64,
		tileSize: tileSize,
		targetAgent: playerClass,
		levels: levels //for astar
	};

	var mobClass = new mob.Mob(mobOptions);

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
				mobClass: mobClass,
				bgTileset: bgTileset,
				charTileset: charTileset,
				farmerTileset: farmerTileset,
				stairTileset: stairTileset,
				pickupTileset: pickupTileset,
				tileSize: tileSize
			};
			renderer = new levelRenderer.Renderer(renderOptions);
			updateGame();
		}
	}

	var tilesets = 5;

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

	farmerTileset = new tileset.Tileset({
			spritePath: '../img/farmer.png',
			specPath: '../spec/farmer.json',
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

		//updates mob position and has it move toward player
		mobClass.chooseAction();

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

		// checks for projectile wall collisions
		playerClass.playerProjectiles.forEach(function(projectile) {
			projectileCollision.projectileCollision({projectile: projectile, tileSize: tileSize, levels: levels});
		});

		var exit = collisionManager.collisionDetection(collisionParams);

		if (exit) {
			console.log(levels.num);
			levels = levelManager.LevelChoice(levels.num + 1);
			renderer.levels = levels;
			mobClass.updateMap();
		}

		//checks the collisions for the mob
		collisionParams.playerClass = mobClass;

		collisionManager.collisionDetection(collisionParams);

		// rendering
		renderer.render();

		// update the game in about 1/60 seconds

		requestAnimFrame(function() {
			updateGame();
		});
	}
})();
