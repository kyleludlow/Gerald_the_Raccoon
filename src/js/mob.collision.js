var collisionManager = require('./collisionManager').collisionDetection;


// defines object for mob specific collision events
var mobCollisions = {};

// handles mob non-wall right collision events
mobCollisions.collidesRight = function(levels, entity, baseRow, baseCol) {
    return;
};

// handles mob non-wall left collision events
mobCollisions.collidesLeft = function(levels, entity, baseRow, baseCol) {
    return;
};

// handles mob non-wall below collision events
mobCollisions.collidesBelow = function(levels, entity, baseRow, baseCol) {
    return;
};

// handles mob non-wall above collision events
mobCollisions.collidesAbove = function(levels, entity, baseRow, baseCol) {
    return;
};

// calls the collision manager with mob specific collision event handlers
var mobCollision = function(options) {
    return collisionManager(options, mobCollisions);
};

exports.mobCollision = mobCollision;
