function projectileCollision({projectile, tileSize, levels}) {

	var baseCol = Math.floor(projectile.x/tileSize);
	var baseRow = Math.floor(projectile.y/tileSize);
	var colOverlap = (projectile.x%tileSize) + projectile.width;
	var rowOverlap = (projectile.y%tileSize) + projectile.height;
  console.log(baseCol, baseRow, colOverlap, rowOverlap);

    // check for horizontal projectile collisions

    if(projectile.xVelocity>0){
        if((levels.map[baseRow][baseCol+1] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow+1][baseCol] && rowOverlap)){

            projectile.x=baseCol*tileSize;
            projectile.active = false;

        }
    }

    if(projectile.xVelocity<0){
        if((!levels.map[baseRow][baseCol+1] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow+1][baseCol] && rowOverlap)){

            projectile.x=(baseCol+1)*tileSize;
            projectile.active = false;

        }
    }

	// check for vertical projectile collisions

    if(projectile.yVelocity>0){
        if((levels.map[baseRow+1][baseCol] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow+1][baseCol+1] && !levels.map[baseRow][baseCol+1] && colOverlap)){

            projectile.y = baseRow*tileSize;
            projectile.active = false;

        }
    }

	if(projectile.yVelocity<0){
		if((!levels.map[baseRow+1][baseCol] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow+1][baseCol+1] && levels.map[baseRow][baseCol+1] && colOverlap)){

			projectile.y = (baseRow+1)*tileSize;
      projectile.active = false;
		}
	}
};

exports.projectileCollision = projectileCollision;
