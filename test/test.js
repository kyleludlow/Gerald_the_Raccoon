var should = require('chai').should();
var Mob = require('../src/js/entities/mob').Mob;



describe('mob', function() {

    var level = {
        map: [
            [1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [1, 1, 1, 0, 0]
        ]
    };
    var targetAgent = {
        x: 128,
        y: 50
    };
    mobX = 32 * 4;
    mobY = 50;
    var mobOptions = {
        levels: level,
        targetAgent: targetAgent,
        tileSize: 32,
        x: mobX,
        y: mobY
    };
    var mob = new Mob(mobOptions);

    describe('aStar', function() {
        it('when coming from above and right should ', function() {
          mob.getAStarMovement().should.have.property('x');
        });
    })
    it('should', function() {

    });
});
