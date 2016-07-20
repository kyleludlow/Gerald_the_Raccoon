(function(){

	var canvas = document.getElementById("canvas");   // the canvas where game will be drawn
	var context = canvas.getContext("2d");            // canvas context
	var levelManager = require('./levelManager');
	var levels = levelManager.LevelChoice(1);


	// console.log(levelManager);

	var levelCols = levels.map[0].length;							// level width, in tiles
	var levelRows = levels.map.length;							// level height, in tiles
	var tileSize = 32;							// tile size, in pixels
	var playerCol = levels.playerCol;                                  // player starting column
	var playerRow = levels.playerRow;                                  // player starting row
	var leftPressed = false;                            // are we pressing LEFT arrow key?
	var rightPressed = false;                           // are we pressing RIGHT arrow key?
	var upPressed = false;                              // are we pressing UP arrow key?
	var downPressed = false;                            // are we pressing DOWN arrow key?
	var movementSpeed = 10;                              // the speed we are going to move, in pixels per frame
	var playerXSpeed = 0;                               // player horizontal speed, in pixels per frame
	var playerYSpeed = 0; 

	var playerYPos=playerRow*tileSize;				// converting Y player position from tiles to pixels
	var playerXPos=playerCol*=tileSize;               // converting X player position from tiles to pixels

	canvas.width=tileSize*levelCols;                   // canvas width. Won't work without it even if you style it from CSS
	canvas.height=tileSize*levelRows;                   // canvas height. Same as before

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
		// player = green box
		context.fillStyle = "#00ff00";
		context.fillRect(playerXPos,playerYPos,tileSize,tileSize);
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

		// no friction or inertia at the moment, so at every frame initial speed is set to zero
		playerXSpeed=0;
		playerYSpeed=0;

		// updating speed according to key pressed
		if(rightPressed){
			playerXSpeed=movementSpeed
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

		playerXPos+=playerXSpeed;
		playerYPos+=playerYSpeed;

		// check for horizontal collisions

		var baseCol = Math.floor(playerXPos/tileSize);
		var baseRow = Math.floor(playerYPos/tileSize);
		var colOverlap = playerXPos%tileSize;
		var rowOverlap = playerYPos%tileSize;

		if(playerXSpeed>0){
			if((levels.map[baseRow][baseCol+1] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow+1][baseCol] && rowOverlap)){
				if (levels.map[baseRow][baseCol + 1] === 10) {
					levels = levelManager.LevelChoice(levels.num += 1); 
				}
				playerXPos=baseCol*tileSize;
			}
		}

		if(playerXSpeed<0){
			if((!levels.map[baseRow][baseCol+1] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow+1][baseCol] && rowOverlap)){
				console.log("V1 ", levels.map[baseRow][baseCol])
				if (levels.map[baseRow + 1][baseCol] === 10) {
					levels = levelManager.LevelChoice(levels.num += 1); 
				}
				playerXPos=(baseCol+1)*tileSize;
			}
		}
    
		// check for vertical collisions

		baseCol = Math.floor(playerXPos/tileSize);
		baseRow = Math.floor(playerYPos/tileSize);
		colOverlap = playerXPos%tileSize;
		rowOverlap = playerYPos%tileSize;

		if(playerYSpeed>0){
			if((levels.map[baseRow+1][baseCol] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow][baseCol+1] && colOverlap)){
				
				if (levels.map[baseRow + 1][baseCol] === 10) {
					levels = levelManager.LevelChoice(levels.num += 1); 
				}
				playerYPos = baseRow*tileSize;
			}
		}

		if(playerYSpeed<0){
			if((!levels.map[baseRow+1][baseCol] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow][baseCol+1] && colOverlap)){
				if (levels.map[baseRow][baseCol] === 10) {
					levels = levelManager.LevelChoice(levels.num += 1); 
				}
				playerYPos = (baseRow+1)*tileSize;
			}
		}

		// rendering level

		renderLevel();

		// update the game in about 1/60 seconds

		requestAnimFrame(function() {
			updateGame();
		});
	}

	updateGame();

})();
