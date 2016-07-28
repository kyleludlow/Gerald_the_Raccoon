var utils = require('./utils');

function collisionDetection(options, collisionHandlers) {
    var entity = options.entity;
    var tileSize = options.tileSize;
    var levels = options.levels;
    var baseCol = Math.floor(entity.x / tileSize);
    var baseRow = Math.floor(entity.y / tileSize);
    var colOverlap = entity.x % tileSize;
    var rowOverlap = entity.y % tileSize;


    this.collidesLeft = collisionHandlers.collidesLeft;
    this.collidesRight = collisionHandlers.collidesRight;
    this.collidesAbove = collisionHandlers.collidesAbove;
    this.collidesBelow = collisionHandlers.collidesBelow;


    this.handleCollisions = function() {
        // check for horizontal player collisions

        if (entity.xSpeed > 0) {
            if ((levels.map[baseRow][baseCol + 1] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow + 1][baseCol + 1] && !levels.map[baseRow + 1][baseCol] && rowOverlap)) {

                entity.x = baseCol * tileSize;
								return this.collidesRight(levels, this.entity, baseRow, baseCol);
            }
        }

        if (entity.xSpeed < 0) {
            if ((!levels.map[baseRow][baseCol + 1] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow + 1][baseCol + 1] && levels.map[baseRow + 1][baseCol] && rowOverlap)) {

                entity.x = (baseCol + 1) * tileSize;
								return this.collidesLeft(levels, this.entity, baseRow, baseCol);

            }
        }

        // check for vertical player collisions

        if (entity.ySpeed > 0) {
            if ((levels.map[baseRow + 1][baseCol] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow + 1][baseCol + 1] && !levels.map[baseRow][baseCol + 1] && colOverlap)) {

								entity.y = baseRow * tileSize;
                return this.collidesBelow(levels, this.entity, baseRow, baseCol);
            }
        }

        if (entity.ySpeed < 0) {
            if ((!levels.map[baseRow + 1][baseCol] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow + 1][baseCol + 1] && levels.map[baseRow][baseCol + 1] && colOverlap)) {

                entity.y = (baseRow + 1) * tileSize;
								return this.collidesAbove(levels, this.entity, baseRow, baseCol);

            }
        }
    }
		return this.handleCollisions();
};

exports.collisionDetection = collisionDetection;
