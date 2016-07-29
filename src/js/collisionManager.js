

function collisionDetection(options, collisionHandlers) {
    var entity = options.entity;
    var tileSize = options.tileSize;
    var levels = options.levels;
    var baseCol = Math.floor(entity.x / tileSize);
    var baseRow = Math.floor(entity.y / tileSize);
    var colOverlap = entity.x % tileSize;
    var rowOverlap = entity.y % tileSize;

		// console.log(entity);

		// defines entity specific collision handlers to be updated by entity
    this.collidesLeft = collisionHandlers.collidesLeft;
    this.collidesRight = collisionHandlers.collidesRight;
    this.collidesAbove = collisionHandlers.collidesAbove;
    this.collidesBelow = collisionHandlers.collidesBelow;

		// handles wall collision and entity-specific collision events
    this.handleCollisions = function() {

        // check for right collisions
        if (entity.xSpeed > 0) {
            if ((levels.map[baseRow][baseCol + 1] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow + 1][baseCol + 1] && !levels.map[baseRow + 1][baseCol] && rowOverlap)) {

								// positions entity along side of the wall
                entity.x = baseCol * tileSize;
								// checks for non-wall collision events and returns accordingly (see entity collisions)
								return this.collidesRight(levels, entity, baseRow, baseCol);
            }
        }

				// checks for left collisions
        if (entity.xSpeed < 0) {
            if ((!levels.map[baseRow][baseCol + 1] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow + 1][baseCol + 1] && levels.map[baseRow + 1][baseCol] && rowOverlap)) {

								// positions entity along side of the wall
                entity.x = (baseCol + 1) * tileSize;
								// checks for non-wall collision events and returns accordingly (see entity collisions)
								return this.collidesLeft(levels, entity, baseRow, baseCol);

            }
        }

				// check for below entity collisions
        if (entity.ySpeed > 0) {
            if ((levels.map[baseRow + 1][baseCol] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow + 1][baseCol + 1] && !levels.map[baseRow][baseCol + 1] && colOverlap)) {

								// positions entity along side of the wall
								entity.y = baseRow * tileSize;
								// checks for non-wall collision events and returns accordingly (see entity collisions)
                return this.collidesBelow(levels, entity, baseRow, baseCol);
            }
        }

				// check for above entity collisions
        if (entity.ySpeed < 0) {
            if ((!levels.map[baseRow + 1][baseCol] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow + 1][baseCol + 1] && levels.map[baseRow][baseCol + 1] && colOverlap)) {

								// positions entity along side of the wall
                entity.y = (baseRow + 1) * tileSize;
								// checks for non-wall collision events and returns accordingly (see entity collisions)
								return this.collidesAbove(levels, entity, baseRow, baseCol);

            }
        }
    }
		return this.handleCollisions();
};

exports.collisionDetection = collisionDetection;
