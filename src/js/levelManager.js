var maps = require('./maps');

var LevelChoice = function(choice) {
    var level = null; 
    switch (choice) {
        case 1:
            level = maps.levels.one;
            break;
        default:
            level = maps.levels.one;
    }
    return level;
};                           

exports.LevelChoice = LevelChoice;

