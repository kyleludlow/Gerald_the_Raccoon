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
