(function(){

	var canvas = document.getElementById("canvas");   // the canvas where game will be drawn
	var context = canvas.getContext("2d");            // canvas context

	var levelManager = require('./levelManager');
	var levels = levelManager.LevelChoice(1);

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

	var playerYPos=playerRow*tileSize;		// converting Y player position from tiles to pixels
	var playerXPos=playerCol*=tileSize;   // converting X player position from tiles to pixels

	canvas.width=tileSize*levelCols;   // canvas width. Won't work without it even if you style it from CSS
	canvas.height=tileSize*levelRows;  // canvas height. Same as before




	// simple WASD listeners

	document.addEventListener("keydown", function(e){
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

	document.addEventListener("keyup", function(e){
		switch(e.keyCode){
			case 65:
				leftPressed=false;
				break;
			case 87:
				upPressed=false;
				break;
			case 68:
				rightPressed=false;
				break;
			case 83:
				downPressed=false;
				break;
			case 32:
				spacePressed=false;
		}
	}, false);


	function Projectile(I) {
	  I.active = true;

		// defaults x an y velocity for shooting upward
	  I.xVelocity = 0;
	  I.yVelocity = -I.speed;

		I.width = 3;
	  I.height = 3;
	  I.color = "#8A2BE2";

		// adjusts x and y velocity to change projectile direction per facing direction
		switch (I.facing) {
			case 'up':
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
	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	},
	update: function() {
		// no friction or inertia at the moment, so at every frame initial speed is set to zero
		this.xSpeed=0;
		this.ySpeed=0;

		// shoot projectile if space pressed
		if (spacePressed){
			this.shoot();
		}

		// updating speed according to key pressed
		if(rightPressed){
			this.xSpeed=movementSpeed;
			this.facing = 'right';
		}
		else{
			if(leftPressed){
				this.xSpeed=-movementSpeed;
				this.facing = 'left';
			}
			else{
				if(upPressed){
					this.ySpeed=-movementSpeed;
					this.facing = 'up';
				}
				else{
					if(downPressed){
						this.ySpeed=movementSpeed;
						this.facing = 'down';
					}
				}
			}
		}

		// updating player position
		this.x +=this.xSpeed;
		this.y +=this.ySpeed;

	},
	shoot: function() {
		var projectilePosition = this.midpoint();

  	playerProjectiles.push(Projectile({
    	speed: 5,
    	x: projectilePosition.x,
    	y: projectilePosition.y,
			facing: this.facing
  	}));
	},
	midpoint: function() {
		return {
			x: this.x + this.width/2,
			y: this.y + this.height/2
		};
	}
};

function collisionDetection() {

	// check for horizontal player collision
	var baseCol = Math.floor(playerClass.x/tileSize);
	var baseRow = Math.floor(playerClass.y/tileSize);
	var colOverlap = playerClass.x%tileSize;
	var rowOverlap = playerClass.y%tileSize;

		if(playerClass.xSpeed>0){
			if((levels.map[baseRow][baseCol+1] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow+1][baseCol] && rowOverlap)){
				if (levels.map[baseRow][baseCol + 1] === 10) {
					levels = levelManager.LevelChoice(levels.num += 1);
				}
				playerClass.x=baseCol*tileSize;
			}
		}


		if(playerClass.xSpeed<0){
			if((!levels.map[baseRow][baseCol+1] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow+1][baseCol] && rowOverlap)){
				console.log("V1 ", levels.map[baseRow][baseCol])
				if (levels.map[baseRow + 1][baseCol] === 10) {
					levels = levelManager.LevelChoice(levels.num += 1);
				}
				playerClass.x=(baseCol+1)*tileSize;
			}
		}


	// check for vertical player collisions

	baseCol = Math.floor(playerClass.x/tileSize);
	baseRow = Math.floor(playerClass.y/tileSize);
	colOverlap = playerClass.x%tileSize;
	rowOverlap = playerClass.y%tileSize;


		if(playerClass.ySpeed>0){
			if((levels.map[baseRow+1][baseCol] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow][baseCol+1] && colOverlap)){

				if (levels.map[baseRow + 1][baseCol] === 10) {
					levels = levelManager.LevelChoice(levels.num += 1);
				}
				playerClass.y = baseRow*tileSize;
			}
		}


	if(playerClass.ySpeed<0){
		if((!levels.map[baseRow+1][baseCol] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow][baseCol+1] && colOverlap)){
			if (levels.map[baseRow][baseCol] === 10) {
				levels = levelManager.LevelChoice(levels.num += 1);
			}
			playerClass.y = (baseRow+1)*tileSize;
		}
	}
};


	// function to display the level
	function renderLevel(){
		// clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		// walls = red boxes
		for(i=0;i<levelRows;i++){
			for(j=0;j<levelCols;j++){
				if(levels.map[i][j]==1){
					context.fillStyle = "#ff0000";
					context.fillRect(j*tileSize,i*tileSize,tileSize,tileSize);
				}
				else if (levels.map[i][j] === 10) {
					context.fillStyle = "#000000";
					context.fillRect(j*tileSize,i*tileSize,tileSize,tileSize);
				}
			}
		}
		playerClass.draw();
		playerProjectiles.forEach(function(projectile) {
			projectile.draw();
		});
	}


	// this function will do its best to make stuff work at 60FPS - please notice I said "will do its best"
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000/60);
		};
	})();


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
		collisionDetection();

		// rendering level

		renderLevel();

		// update the game in about 1/60 seconds

		requestAnimFrame(function() {
			updateGame();
		});
	}

	updateGame();

})();
