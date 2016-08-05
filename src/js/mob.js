var astar = require('../lib/astar');
var game = require('./app.js');

var Mob = function(options) {
    this.updateMap(options.levels);
    this.targetAgent = options.targetAgent;
    this.width = options.tileSize;
    this.height = options.tileSize;
    this.tileSize = options.tileSize;
    this.x = options.x;
    this.y = options.y;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.score = 0;
    this.sprite = new Image();
    this.facing = 'down';
    this.context = options.context;
    this.active = true;
};

// draws mob sprite onto the canvas
Mob.prototype.draw = function() {
    var singleTileSpec;

    switch (this.facing) {
        case 'up':
            this.sprite.src = './img/farmerUp.png';
            singleTileSpec = {
                x: 0,
                y: 0
            };
            break;
        case 'left':
            this.sprite.src = './img/farmerLeft.png';
            singleTileSpec = {
                x: 0,
                y: 0
            };
            break;
        case 'down':
            this.sprite.src = './img/farmerDown.png';
            singleTileSpec = {
                x: 0,
                y: 0
            };
            break;
        case 'right':
            this.sprite.src = './img/farmerRight.png';
            singleTileSpec = {
                x: 0,
                y: 0
            };
            break;
        default:
    }
    this.context.drawImage(
        this.sprite,
        singleTileSpec.x, singleTileSpec.y, this.tileSize, this.tileSize,
        Math.floor(this.x), Math.floor(this.y), this.tileSize, this.tileSize
    );
};

//retrieves level and converts map to walkable (w) vs
// unwalkable (u) tiles for pathfinding
Mob.prototype.updateMap = function(level) {
    this.levels = level.map;
    this.walkableMap = this.levels.map(function(row) {
        return row.map(function(tile) {
            // if tile is a trashcan or dungeon floor, return walkable, else unwalkable
            if (tile === 4 || tile === 0) {
                return 'w'
            } else {
                return 'u'
            }
        })
    });
};

//individualizes map tiles
Mob.prototype.getMap = function() {
    return this.walkableMap.map(function(row) {
        return row.map(function(tile) {
            return tile;
        });
    });
};

//calculates location of start (s--where the monster is)
//and goal (g--where the player is)
Mob.prototype.getAStarMovement = function() {
    //retrieves walkable map
    var map = this.getMap(),
        path;

    //determines currently occupied tile for mob
    tileX = Math.floor(this.x / this.width);
    tileY = Math.floor(this.y / this.height);

    //determines currently occupied tile for player
    targetX = Math.floor(this.targetAgent.x / this.width);
    targetY = Math.floor(this.targetAgent.y / this.height);

    //assigns start and goal tiles on map
    map[tileY][tileX] = 's';
    map[targetY][targetX] = 'g';


    // calculates best path between s and g
    //map === walkable level map
    //'manhattan' === "discovery" of g method
    //true === allows monster to cut corners
    path = astar(map, 'manhattan', true);

    if (path && path.length > 1) {
        return {
            x: path[1].col,
            y: path[1].row
        };
    }
    return {
        x: this.x,
        y: this.y
    };
};

//provides information for where mob should move
Mob.prototype.moveToTarget = function(nextMove) {

    var nextMove = nextMove || this.getAStarMovement();

    // if not occupying the same tile, distance calculated between
    // mob and player calculated using sprite(tile) width.
    var dx = (nextMove.x * this.width) - this.x;
    var dy = (nextMove.y * this.height) - this.y;

    // if next move is on the same tile, calculate distance by
    // only x and y coordinates for precision
    if (nextMove.near) {
        dx = (nextMove.x) - this.x;
        dy = (nextMove.y) - this.y;
    }

    // move 1.25 pixels in direction depending on sign
    // up and left for negative, down and right for positive
    var moveX = Math.sign(dx) * 1.25;
    var moveY = Math.sign(dy) * 1.25;

    this.move(moveX, moveY);
};

//movement pattern for mob, updates mob position for rendering
Mob.prototype.move = function(moveX, moveY) {
    this.x += moveX;
    this.y += moveY;
    this.xSpeed = moveX;
    this.ySpeed = moveY;

    // used to determine which sprite to render based on
    // direction gerald is facing
    if (moveX > 0) {
        this.facing = 'right';
    } else if (moveX < 0) {
        this.facing = 'left';
    } else if (moveY > 0) {
        this.facing = 'up';
    } else if (moveY < 0) {
        this.facing = 'down';
    } else {
        this.facing = 'down';
    }
};

Mob.prototype.atTarget = function() {
    // stop the game when mob collides with Gerald
    game.setGameCycle();
    // display death screen
    $('.death-wrapper').animate({
        left: "0"
    }).on('click', 'button', function() {
        $('.death-wrapper').animate({
            left: '-100vw',
            display: 'none'
        });
        // lose focus on the start again button otherwise it's triggered by spacebar.
        $(this).blur();
    })
};

Mob.prototype.chooseAction = function() {

    // if the mob is under one tile width away (32px) from Gerald, skip pathfinding.
    if (Math.abs(this.y - this.targetAgent.y) < 32 && Math.abs(this.x - this.targetAgent.x) < 32) {

        // if the mob touches Gerald (16px is half the mob width from center) call atTarget for end of game
        if (Math.abs(this.y - this.targetAgent.y) < 16 && Math.abs(this.x - this.targetAgent.x) < 16) {
            this.atTarget();
        }

        // skips pathfinding and immediately calls for next move calculation based on |x - y|
        var nextMove = {
            x: this.targetAgent.x,
            y: this.targetAgent.y,
            near: true
        };
        this.moveToTarget(nextMove);
    }

    // else call moveToTarget for pathfinding and next movement calulation chain
    else {
        this.moveToTarget();
    }
};
// on projectile collision, mob explodes, going inactive to be spliced from next render cycle
Mob.prototype.explode = function() {
    this.active = false;
};

exports.Mob = Mob;
