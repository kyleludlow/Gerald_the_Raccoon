// sets projectile direction, draws projectile, updates projectile, contains projectile

function makeProjectile(I, canvas) {

  I.active = true;
	I.image = new Image();
	var lastFire;

	// adjusts x and y velocity to change projectile direction per facing direction
	switch (I.facing) {
		case 'up':
			I.xVelocity = 0;
			I.yVelocity = -I.speed;
			I.width = 30;
  		I.height = 64;
			I.image.src = './img/fireball_up.png';
			break;
		case 'right':
			I.xVelocity = I.speed;
			I.yVelocity = 0;
			I.width = 64;
  		I.height = 30;
			I.image.src = './img/fireball_right.png';
			break;
		case 'down':
			I.xVelocity = 0;
			I.yVelocity = I.speed;
			I.width = 30;
			I.height = 64;
			I.image.src = './img/fireball_down.png';
			break;
		case 'left':
			I.xVelocity = -I.speed;
			I.yVelocity = 0;
			I.width = 64;
  		I.height = 30;
			I.image.src = './img/fireball.gif';
			break;
		default:
			console.log('projectile aiming broke');
	}

  I.inBounds = function() {
    return I.x >= 0 && I.x <= canvas.width &&
      I.y >= 0 && I.y <= canvas.height;
  };

  I.draw = function() {
		var context = canvas.getContext("2d");
		context.drawImage(I.image, I.x - 25, I.y - 15, this.width, this.height);
  };
	
  I.update = function() {
    I.x += I.xVelocity;
    I.y += I.yVelocity;

    I.active = I.active && I.inBounds();
  };

  return I;
};

exports.makeProjectile = makeProjectile;
