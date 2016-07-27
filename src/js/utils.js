var init = function() {
  $('.play').on('click', function() {
    $('.intro-screen').fadeOut(500);
  })
  textWobbler('Gerald The Raccoon', '.intro-wrapper h1');
};

function textWobbler(text, el) {
  var el = document.querySelector(el);
  var output = document.createElement('span');
  for (var i = 0; i < text.length; i++) {
    var span = document.createElement('span');
    var letter = document.createTextNode(text[i]);
    span.classList = 'wobble';
    span.appendChild(letter);
    if (span.textContent === " ") {
      span.style.padding = "0.3em";
    }
    span.style.animationDuration = (Math.random() * (1.5 - 0.5 + 1) + 0.5) + 's';
    output.appendChild(span);
  }
  el.textContent = '';
  el.appendChild(output);
}

exports.init = init;
exports.textWobbler = textWobbler;