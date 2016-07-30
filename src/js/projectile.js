// sets projectile direction, draws projectile, updates projectile, contains projectile
function makeProjectile(I, canvas) {

  I.active = true;
	I.image = new Image();
	var lastFire;

	// adjusts x and y velocity to change projectile direction per facing direction
  // also changes fireball sprite and dimensions accordingly
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

  // draws projectile sprite to map
  I.draw = function() {
    if (I.active) {
      var context = canvas.getContext("2d");
  		context.drawImage(I.image, I.x - 25, I.y - 15, this.width, this.height);
    }
  };

  // updates projectile x and y coordinates on map
  I.update = function() {
    if (I.active) {
      I.x += I.xVelocity;
      I.y += I.yVelocity;
    }
  };
  return I;
};

exports.makeProjectile = makeProjectile;
