var tileset = require('./tileset');



function renderLevel({context, levelRows, levelCols, levels, playerClass, playerProjectiles, bgTileset}){
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // walls = red boxes
    for(i=0;i<levelRows;i++){
        for(j=0;j<levelCols;j++){
            if(levels.map[i][j] !== 0 && levels.map[i][j] < 10){
                drawTile(bgTileset.sprite, bgTileset.tileSpec[levels.map[i][j]], j, i);
            }
            else if (levels.map[i][j] === 10) {
                context.fillStyle = "#000000";
                context.fillRect(j*tileSize,i*tileSize,tileSize,tileSize);
            }
        }
    }
    playerClass.draw();
    playerProjectiles.forEach(function(projectile) {
        projectile.draw();
    });
}

exports.renderLevel = renderLevel;