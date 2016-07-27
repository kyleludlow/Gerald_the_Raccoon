var makeProjectile = require('./projectile').makeProjectile;

var Player = function(options) {
  this.color = '#00ff00';
  this.playerProjectiles = [];
  this.keyPresses = {
		leftPressed: false,                   // are we pressing LEFT arrow key?
		rightPressed: false,                  // are we pressing RIGHT arrow key?
		upPressed: false,                    // are we pressing UP arrow key?
		downPressed: false,                  // are we pressing DOWN arrow key?
		spacePressed: false,                  // are we pressing space key?
	};
  this.movementSpeed = 5;
  this.x = options.playerXPos;
  this.y = options.playerYPos;
  this.width = options.tileSize;
  this.height = options.tileSize;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.facing = 'up';
  this.score = 0;
  this.now = Date.now();
};

Player.prototype.update = function() {
  this.xSpeed = 0;
  this.ySpeed = 0;

  //shoot projectile if space pressed and limit fire rate.
  if (this.keyPresses.spacePressed && Date.now() - this.now > 150) {
    this.shoot();
    this.now = Date.now();
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
    speed: 8,
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

Player.prototype.moveStart = function(e) {
  switch(e.keyCode) {
			case 65:
				this.keyPresses.leftPressed = true;
        break;
			case 87:
				this.keyPresses.upPressed = true;
				break;
			case 68:
				this.keyPresses.rightPressed = true;
				break;
			case 83:
				this.keyPresses.downPressed = true;
				break;
			case 32:
				this.keyPresses.spacePressed = true;
				break;
	}
}

Player.prototype.moveStop = function(e) {
  switch(e.keyCode){
			case 65:
				this.keyPresses.leftPressed = false;
				break;
			case 87:
				this.keyPresses.upPressed = false;
				break;
			case 68:
				this.keyPresses.rightPressed = false;
				break;
			case 83:
				this.keyPresses.downPressed = false;
				break;
			case 32:
				this.keyPresses.spacePressed = false;
	}
}


exports.Player = Player;
