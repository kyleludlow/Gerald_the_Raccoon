var maps = require('./maps');

// function to send the correct map to the renderer.

var LevelChoice = function(choice) {
    var level = null;
    switch (choice) {
        case 1:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.one.map)), // deep clone of original map. Otherwise pickups are not rerendered wen the level comes around again.
                num: maps.levels.one.num, // used by level manager to know what the next level will be
                playerCol: maps.levels.one.playerCol,
                playerRow: maps.levels.one.playerRow
            }
            break;
        case 2:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.two.map)),
                num: maps.levels.two.num,
                playerCol: maps.levels.two.playerCol,
                playerRow: maps.levels.two.playerRow
            }
            break;
        case 3:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.three.map)),
                num: maps.levels.three.num,
                playerCol: maps.levels.three.playerCol,
                playerRow: maps.levels.three.playerRow
            }
            break;
        case 4:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.four.map)),
                num: maps.levels.four.num,
                playerCol: maps.levels.four.playerCol,
                playerRow: maps.levels.four.playerRow
            }
            break;
        default:
            level = {
                map: JSON.parse(JSON.stringify(maps.levels.one.map)),
                num: maps.levels.one.num,
                playerCol: maps.levels.one.playerCol,
                playerRow: maps.levels.one.playerRow
            }
    }
    return level;
};

exports.LevelChoice = LevelChoice;
