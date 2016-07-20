(function(){

	var canvas = document.getElementById("canvas");   // the canvas where game will be drawn
	var context = canvas.getContext("2d");            // canvas context
	var levelCols=11;							// level width, in tiles
	var levelRows=9;							// level height, in tiles
	var tileSize=32;							// tile size, in pixels
	var playerCol=5;              // player starting column
	var playerRow=4;              // player starting row
	var leftPressed=false;        // are we pressing LEFT arrow key?
	var rightPressed=false;       // are we pressing RIGHT arrow key?
	var upPressed=false;          // are we pressing UP arrow key?
	var downPressed=false;        // are we pressing DOWN arrow key?
	var movementSpeed=5;         // the speed we are going to move, in pixels per frame
	var playerXSpeed=0;           // player horizontal speed, in pixels per frame
	var playerYSpeed=0;           // player vertical speed, in pixels per frame

	var level = [        						// the 11x9 level - 1=wall, 0=empty space
		[1,1,1,1,1,1,1,1,1,1,1],
		[1,1,0,0,0,0,0,0,0,1,1],
		[1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,1,0,1,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,1,0,1,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,1],
		[1,1,0,0,0,0,0,0,0,1,1],
		[1,1,1,1,1,1,1,1,1,1,1]
	];

	var playerYPos=playerRow*tileSize;		// converting Y player position from tiles to pixels
	var playerXPos=playerCol*=tileSize;   // converting X player position from tiles to pixels

	canvas.width=tileSize*levelCols;   // canvas width. Won't work without it even if you style it from CSS
	canvas.height=tileSize*levelRows;  // canvas height. Same as before

	// simple WASD listeners

	document.addEventListener("keydown", function(e){
		console.log(e.keyCode);
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
		}
	}, false);

var playerClass = {
	color: '#00ff00',
	x: playerXPos,
	y: playerYPos,
	width: tileSize,
	height: tileSize,
	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	},
	update: function() {
		// no friction or inertia at the moment, so at every frame initial speed is set to zero
		playerXSpeed=0;
		playerYSpeed=0;

		// updating speed according to key pressed
		if(rightPressed){
			playerXSpeed=movementSpeed;
		}
		else{
			if(leftPressed){
				playerXSpeed=-movementSpeed;
			}
			else{
				if(upPressed){
					playerYSpeed=-movementSpeed;
				}
				else{
					if(downPressed){
						playerYSpeed=movementSpeed;
					}
				}
			}
		}

		// updating player position

		this.x +=playerXSpeed;
		this.y +=playerYSpeed;

	}
};


	// function to display the level

	function renderLevel(){
		// clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		// walls = red boxes
		context.fillStyle = "#ff0000";
		for(i=0;i<levelRows;i++){
			for(j=0;j<levelCols;j++){
				if(level[i][j]==1){
					context.fillRect(j*tileSize,i*tileSize,tileSize,tileSize);
				}
			}
		}
		// player = green box
		// context.fillStyle = "#00ff00";
		// context.fillRect(playerXPos,playerYPos,tileSize,tileSize);
		playerClass.draw();
	}


function collisionDetection() {
	var baseCol = Math.floor(playerClass.x/tileSize);
	var baseRow = Math.floor(playerClass.y/tileSize);
	var colOverlap = playerClass.x%tileSize;
	var rowOverlap = playerClass.y%tileSize;

	if(playerXSpeed>0){
		if((level[baseRow][baseCol+1] && !level[baseRow][baseCol]) || (level[baseRow+1][baseCol+1] && !level[baseRow+1][baseCol] && rowOverlap)){
			playerClass.x=baseCol*tileSize;
		}
	}

	if(playerXSpeed<0){
		if((!level[baseRow][baseCol+1] && level[baseRow][baseCol]) || (!level[baseRow+1][baseCol+1] && level[baseRow+1][baseCol] && rowOverlap)){
			playerClass.x=(baseCol+1)*tileSize;
		}
	}

	// check for vertical collisions

	baseCol = Math.floor(playerClass.x/tileSize);
	baseRow = Math.floor(playerClass.y/tileSize);
	colOverlap = playerClass.x%tileSize;
	rowOverlap = playerClass.y%tileSize;

	if(playerYSpeed>0){
		if((level[baseRow+1][baseCol] && !level[baseRow][baseCol]) || (level[baseRow+1][baseCol+1] && !level[baseRow][baseCol+1] && colOverlap)){
			playerClass.y = baseRow*tileSize;
		}
	}

	if(playerYSpeed<0){
		if((!level[baseRow+1][baseCol] && level[baseRow][baseCol]) || (!level[baseRow+1][baseCol+1] && level[baseRow][baseCol+1] && colOverlap)){
			playerClass.y = (baseRow+1)*tileSize;
		}
	}
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
