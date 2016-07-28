var collisionManager = require('./collisionManager').collisionDetection;


// var playerCollision = function(options) {
//   var playerCollide = new collisionDetection(options);
//   collisionManager.call(this, options)
// }



var playerCollisions = {};

playerCollisions.collidesHorizontalRight = function(levels, entity, baseRow, baseCol) {
  if (levels.map[baseRow][baseCol + 1] === 10) {
      return true;
  }
  else if (levels.map[baseRow][baseCol + 1] === 11) {
          entity.score += 1;
          utils.textWobbler(`Score: ${entity.score}`, '.score');
          levels.map[baseRow][baseCol + 1] = 0;
  }
};

playerCollisions.collidesHorizontalLeft = function(levels, entity, baseRow, baseCol) {
  if (levels.map[baseRow + 1][baseCol] === 10) {
      return true;
  }
  else if (levels.map[baseRow + 1][baseCol] === 11) {
          entity.score += 1;
          utils.textWobbler(`Score: ${entity.score}`, '.score');
          levels.map[baseRow + 1][baseCol] = 0;
  }
};

playerCollisions.collidesVerticalBelow = function(levels, entity, baseRow, baseCol) {
  if (levels.map[baseRow + 1][baseCol] === 10) {
      return true;
  }
  else if (levels.map[baseRow + 1][baseCol] === 11) {
          entity.score += 1;
          utils.textWobbler(`Score: ${entity.score}`, '.score');
          levels.map[baseRow + 1][baseCol] = 0;
  }
};

playerCollisions.collidesVerticalAbove = function(levels, entity, baseRow, baseCol) {
  if (levels.map[baseRow][baseCol] === 10) {
                return true;
  }
  else if (levels.map[baseRow][baseCol] === 11) {
          entity.score += 1;
          utils.textWobbler(`Score: ${entity.score}`, '.score');
          levels.map[baseRow][baseCol] = 0;
  }
};

var playerCollision = function(options) {
  collisionManager.call(this, options, playerCollisions);
};

exports.playerCollision = playerCollision;
