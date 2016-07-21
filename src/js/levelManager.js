var maps = require('./maps');

var LevelChoice = function(choice) {
    var level = null; 
    switch (choice) {
        case 1:
            level = maps.levels.one;
            break;
        case 2:
            level = maps.levels.two;
            break;
        case 3:
            level = maps.levels.three;
            break;
        case 4:
            level = maps.levels.four;
            break;
        default:
            level = maps.levels.one;
    }
    return level;
};                           

exports.LevelChoice = LevelChoice;

