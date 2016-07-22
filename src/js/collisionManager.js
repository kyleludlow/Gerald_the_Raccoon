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