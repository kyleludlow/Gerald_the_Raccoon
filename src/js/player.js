var makeProjectile = require('./projectile').makeProjectile;

var Player = function(options) {
  this.playerProjectiles = [];    // shot projectiles array
  this.keyPresses = {             // are hotkeys being pressed?
		leftPressed: false,
		rightPressed: false,
		upPressed: false,
		downPressed: false,
		spacePressed: false,
	};
  this.movementSpeed = 5;
  this.x = options.playerXPos;    // player x coordinate on map
  this.y = options.playerYPos;    // player y coordinate on map
  this.width = options.tileSize;  // player width
  this.height = options.tileSize; // player height
  this.xSpeed = 0;                // horizontal speed
  this.ySpeed = 0;                // vertical speed
  this.facing = 'up';             // facing direction
  this.score = 0;                 // current game score
  this.now = Date.now();          // current timestamp to help limit fire rate
};

// updates player speed, position, and shooting
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

// sends projectile options to factory for rendering
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

// calculates the player middle for projectile starting location
Player.prototype.midpoint = function() {
  return {
    x: this.x + this.width/2,
    y: this.y + this.height/2
  };
};

// stores movement and projectile hotkey keydowns
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

// stores movement and projectile hotkey keyups
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
