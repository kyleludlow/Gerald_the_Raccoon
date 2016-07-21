// sets projectile direction, draws projectile, updates projectile, contains projectile

	function makeProjectile(I, canvas) {

	  I.active = true;


		I.width = 3;
	  I.height = 3;
	  I.color = "#8A2BE2";

		// adjusts x and y velocity to change projectile direction per facing direction
		switch (I.facing) {
			case 'up':
				I.xVelocity = 0;
				I.yVelocity = -I.speed;
				break;
			case 'right':
				I.xVelocity = I.speed;
				I.yVelocity = 0;
				break;
			case 'down':
				I.xVelocity = 0;
				I.yVelocity = I.speed;
				break;
			case 'left':
				I.xVelocity = -I.speed;
				I.yVelocity = 0;
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
	    context.fillStyle = this.color;
	    context.fillRect(this.x, this.y, this.width, this.height);
	  };

	  I.update = function() {
	    I.x += I.xVelocity;
	    I.y += I.yVelocity;

	    I.active = I.active && I.inBounds();
	  };

	  return I;
	};

exports.makeProjectile = makeProjectile;
