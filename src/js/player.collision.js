var collisionManager = require('./collisionManager').collisionDetection;
var utils = require('./utils');

// defines object for player specific collision events
var playerCollisions = {};

// handles player non-wall right collision events
playerCollisions.collidesRight = function(levels, entity, baseRow, baseCol) {
    // if the tile to the right is a staircase, return true for level handling
    console.log("YO ", entity);
    if (levels.map[baseRow][baseCol + 1] === 10) {
        return true;
    }
    // else if the tile to the right is a trashcan, player score increased and trashcan removed
    else if (levels.map[baseRow][baseCol + 1] === 11) {
        entity.score += 1;
        utils.textWobbler(`Score: ${entity.score}`, '.score');
        return levels.map[baseRow][baseCol + 1] = 0;
    }
};

// handles player non-wall left collision events
playerCollisions.collidesLeft = function(levels, entity, baseRow, baseCol) {
    // if the tile to the left is a staircase, return true for level handling
    if (levels.map[baseRow + 1][baseCol] === 10) {
        return true;
    }
    // else if the tile to the left is a trashcan, player score increased and trashcan removed
    else if (levels.map[baseRow + 1][baseCol] === 11) {
        entity.score += 1;
        utils.textWobbler(`Score: ${entity.score}`, '.score');
        return levels.map[baseRow + 1][baseCol] = 0;
    }
};

// handles player non-wall below collision events
playerCollisions.collidesBelow = function(levels, entity, baseRow, baseCol) {
    // if the tile below is a staircase, return true for level handling
    if (levels.map[baseRow + 1][baseCol] === 10) {
        return true;
    }
    // else if the tile below is a trashcan, player score increased and trashcan removed
    else if (levels.map[baseRow + 1][baseCol] === 11) {
        entity.score += 1;
        utils.textWobbler(`Score: ${entity.score}`, '.score');
        return levels.map[baseRow + 1][baseCol] = 0;
    }
};

// handles player non-wall above collision events
playerCollisions.collidesAbove = function(levels, entity, baseRow, baseCol) {
    // if the tile above is a staircase, return true for level handling
    if (levels.map[baseRow][baseCol] === 10) {
        return true;
    }
    // else if the tile above is a trashcan, player score increased and trashcan removed
    else if (levels.map[baseRow][baseCol] === 11) {
        entity.score += 1;
        utils.textWobbler(`Score: ${entity.score}`, '.score');
        return levels.map[baseRow][baseCol] = 0;
    }
};

// calls the collision manager with player specific collision event handlers
var playerCollision = function(options) {
    // if player collides with staircase, return true for level handling
    if (collisionManager(options, playerCollisions) === true) {
        return true;
    }

    return collisionManager(options, playerCollisions);

};

exports.playerCollision = playerCollision;
