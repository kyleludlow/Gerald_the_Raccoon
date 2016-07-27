var collisionManager = require('./collisionManager').collisionDetection;


var playerCollision = function(options) {
  collisionManager.call(this, options)
}

playerCollision.collidesHorizontalRight = function() {
  if (levels.map[baseRow][baseCol + 1] === 10) {
      return true;
  }
  else if (levels.map[baseRow][baseCol + 1] === 11) {
      if (entity.hasOwnProperty("playerProjectiles")) {
          entity.score += 1;
          utils.textWobbler(`Score: ${entity.score}`, '.score');
          levels.map[baseRow][baseCol + 1] = 0;
      }
  }
};

playerCollision.collidesHorizontalLeft = function() {
  if (levels.map[baseRow + 1][baseCol] === 10) {
      return true;
  }
  else if (levels.map[baseRow + 1][baseCol] === 11) {
      if (entity.hasOwnProperty("playerProjectiles")) {
          entity.score += 1;
          utils.textWobbler(`Score: ${entity.score}`, '.score');
          levels.map[baseRow + 1][baseCol] = 0;
      }
  }
};

playerCollision.collidesVerticalBelow = function() {
  if (levels.map[baseRow + 1][baseCol] === 10) {
      return true;
  }
  else if (levels.map[baseRow + 1][baseCol] === 11) {
      if (entity.hasOwnProperty("playerProjectiles")) {
          entity.score += 1;
          utils.textWobbler(`Score: ${entity.score}`, '.score');
          levels.map[baseRow + 1][baseCol] = 0;
      }
  }
};

playerCollision.collidesVerticalAbove = function() {
  if (levels.map[baseRow][baseCol] === 10) {
                return true;
  }
  else if (levels.map[baseRow][baseCol] === 11) {
      if (entity.hasOwnProperty("playerProjectiles")) {
          entity.score += 1;
          utils.textWobbler(`Score: ${entity.score}`, '.score');
          levels.map[baseRow][baseCol] = 0;
      }
  }
};

exports.playerCollision = playerCollision;
