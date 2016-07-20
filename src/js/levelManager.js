var maps = require('./maps');

var LevelChoice = function(choice) {
    var level = null; 
    switch (choice) {
        case 1:
            level = maps.Maps.level_1;
            break;
        default:
            console.log('not working');
    }
    return level;
};                           

exports.LevelChoice = LevelChoice;

