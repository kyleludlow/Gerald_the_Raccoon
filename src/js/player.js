var makeProjectile = require('./projectile').makeProjectile;

var Player = function(options) {
  this.color = '#00ff00';
  this.playerProjectiles = [];
  this.keyPresses = options.keyPresses;
  this.movementSpeed = options.movementSpeed;
  this.x = options.playerXPos;
  this.y = options.playerYPos;
  this.width = options.tileSize;
  this.height = options.tileSize;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.facing = 'up';
};

Player.prototype.update = function() {
  this.xSpeed = 0;
  this.ySpeed = 0;

  //shoot projectile if space pressed
  if (this.keyPresses.spacePressed) {
    this.shoot();
  }

  //updates speed according to pressed key
  if (this.keyPresses.rightPressed) {
    this.xSpeed = this.movementSpeed;
    this.facing = 'right';
  }
  else {
    if (this.keyPresses.leftPressed) {
      this.xSpeed = -(this.movementSpeed);
      this.facing = 'left';
    }
    else {
      if (this.keyPresses.upPressed) {
        this.ySpeed = -(this.movementSpeed);
        this.facing = 'up';
      }
      else {
        if (this.keyPresses.downPressed) {
          this.ySpeed = this.movementSpeed;
          this.facing = 'down';
        }
      }
    }
  }
  this.x += this.xSpeed;
  this.y += this.ySpeed;
};

Player.prototype.shoot = function() {
  var projectilePosition = this.midpoint();

  var projectile = makeProjectile({
    speed: 5,
    x: projectilePosition.x,
    y: projectilePosition.y,
    facing: this.facing
  }, canvas);
  this.playerProjectiles.push(projectile);
};

Player.prototype.midpoint = function() {
  return {
    x: this.x + this.width/2,
    y: this.y + this.height/2
  };
};

exports.Player = Player;
