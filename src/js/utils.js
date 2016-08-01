var game = require('./app');

// init function to enable hiding of intro screen and anything else needed on startup.
var init = function() {
  resizeIntro(); // make sure intro screen fills the viewport...
  textWobbler('Gerald The Raccoon', '.intro-wrapper h1');
  textWobbler('Play Again?', '.death button');
  preload([
    'img/animals.gif',
    'img/door.png',
    'img/farmer.png',
    'img/farmerDown.png',
    'img/farmerLeft.png',
    'img/farmerUp.png',
    'img/farmerRight.png',
    'img/fireball.gif',
    'img/fireball_die_down.png',
    'img/fireball_die_left.png',
    'img/fireball_die_right.png',
    'img/fireball_die_up.png',
    'img/leftFacingT.png',
    'img/PonAndCon.gif',
    'img/PonAndCon-backwards.png',
    'img/PonAndConReverse.gif',
    'img/rightFacingT.png',
    'img/stairs.png',
    'img/trash_can.png',
    'img/tTiles.png',
    'img/upsideDownT.png',
    'img/walls.png'
  ])
  $(window).on('resize', function() {
    resizeIntro();
  })
};

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

// broke wobbly text idea into function so it can be used across the app.
function textWobbler(text, el) {
  var el = document.querySelector(el); // find the required element in the page.
  var output = document.createElement('span'); // create a span to export
  for (var i = 0; i < text.length; i++) { // loop over each letter in the given sentence
    var span = document.createElement('span'); // create a span for each letter
    var letter = document.createTextNode(text[i]); // create a text node out of the given letter.
    span.classList = 'wobble'; // add the wobble class to the span....
    span.appendChild(letter); // ...and put the letter inside it.
    if (span.textContent === " ") {
      span.style.padding = "0.3em"; // spaces were being ignored, so if it is a space give the span padding as an illusion of a space
    }
    span.style.animationDuration = (Math.random() * (1.5 - 0.5 + 1) + 0.5) + 's'; // add a random animation duration so every letter wobbles at a different speed
    output.appendChild(span); // put the new wobbly sentence in the main span to export.
  }
  el.textContent = ''; // clear out the original element text, if any.
  el.appendChild(output); // put the whole lot into the given doc element.
}

function resizeIntro() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  $('.intro-screen').css({'width' : width + "px", 'height': height + "px"});
  $('.death-wrapper').css({'width' : width + "px", 'height': height + "px"});
}

exports.init = init;
exports.textWobbler = textWobbler;