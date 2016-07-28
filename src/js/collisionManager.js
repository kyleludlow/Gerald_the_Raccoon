var utils = require('./utils');

function collisionDetection(options, collisionHandlers) {
    if (!options) options = {}
    var entity = options.entity || 0;
    var tileSize = options.tileSize || 0;
    var levels = options.levels || 0;
    var baseCol = Math.floor(entity.x / tileSize);
    var baseRow = Math.floor(entity.y / tileSize);
    var colOverlap = entity.x % tileSize;
    var rowOverlap = entity.y % tileSize;
		// console.log(options);
		// console.log(levels);

    this.collidesHorizontalLeft = collisionHandlers.collidesHorizontalLeft || function() {
        return;
    };
    this.collidesHorizontalRight = collisionHandlers.collidesHorizontalRight || function() {
        return;
    };
    this.collidesVerticalAbove = collisionHandlers.collidesHorizontalAbove || function() {
        return;
    };
    this.collidesVerticalBelow = collisionHandlers.collidesHorizontalBelow || function() {
        return;
    };

		// console.log(this.collidesHorizontalLeft);

    this.handleCollisions = function() {
        // check for horizontal player collisions
				// var levels = this.levels;
				console.log(levels);
        if (entity.xSpeed > 0) {
            if ((levels.map[baseRow][baseCol + 1] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow + 1][baseCol + 1] && !levels.map[baseRow + 1][baseCol] && rowOverlap)) {
                // if (levels.map[baseRow][baseCol + 1] === 10) {
                //     return true;
                // }
                // else if (levels.map[baseRow][baseCol + 1] === 11) {
                //     if (entity.hasOwnProperty("playerProjectiles")) {
                //         entity.score += 1;
                //         utils.textWobbler(`Score: ${entity.score}`, '.score');
                //         levels.map[baseRow][baseCol + 1] = 0;
                //     }

                // console.log(entity.score);

                // }
                this.collidesHorizontalRight(levels, this.entity, baseRow, baseCol);

                entity.x = baseCol * tileSize;
            }
        }

        if (entity.xSpeed < 0) {
            if ((!levels.map[baseRow][baseCol + 1] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow + 1][baseCol + 1] && levels.map[baseRow + 1][baseCol] && rowOverlap)) {
                // // console.log("V1 ", levels.map[baseRow][baseCol])
                // if (levels.map[baseRow + 1][baseCol] === 10) {
                //     return true;
                // }
                // else if (levels.map[baseRow + 1][baseCol] === 11) {
                //     if (entity.hasOwnProperty("playerProjectiles")) {
                //         entity.score += 1;
                //         utils.textWobbler(`Score: ${entity.score}`, '.score');
                //         levels.map[baseRow + 1][baseCol] = 0;
                //     }
                //
                // }
                this.collidesHorizontalLeft(levels, this.entity, baseRow, baseCol);

                entity.x = (baseCol + 1) * tileSize;
            }
        }

        // check for vertical player collisions

        if (entity.ySpeed > 0) {
            if ((levels.map[baseRow + 1][baseCol] && !levels.map[baseRow][baseCol]) || (levels.map[baseRow + 1][baseCol + 1] && !levels.map[baseRow][baseCol + 1] && colOverlap)) {
                // if (levels.map[baseRow + 1][baseCol] === 10) {
                //     return true;
                // }
                // else if (levels.map[baseRow + 1][baseCol] === 11) {
                //     if (entity.hasOwnProperty("playerProjectiles")) {
                //         entity.score += 1;
                //         utils.textWobbler(`Score: ${entity.score}`, '.score');
                //         levels.map[baseRow + 1][baseCol] = 0;
                //     }
                // }
                //
                this.collidesVerticalBelow(levels, this.entity, baseRow, baseCol);
                entity.y = baseRow * tileSize;
            }
        }

        if (entity.ySpeed < 0) {
            if ((!levels.map[baseRow + 1][baseCol] && levels.map[baseRow][baseCol]) || (!levels.map[baseRow + 1][baseCol + 1] && levels.map[baseRow][baseCol + 1] && colOverlap)) {
                // if (levels.map[baseRow][baseCol] === 10) {
                //               return true;
                // }
                //       else if (levels.map[baseRow][baseCol] === 11) {
                //           if (entity.hasOwnProperty("playerProjectiles")) {
                //               entity.score += 1;
                //               utils.textWobbler(`Score: ${entity.score}`, '.score');
                //               levels.map[baseRow][baseCol] = 0;
                //           }
                //       }
                this.collidesVerticalAbove(levels, this.entity, baseRow, baseCol);
                entity.y = (baseRow + 1) * tileSize;
            }
        }
    }
		this.handleCollisions();
};

exports.collisionDetection = collisionDetection;
