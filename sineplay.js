function chordButton(button, chord) {
  document.querySelector(`.${button}`).addEventListener('click', () => {
    window.playChord(analyser, chord);
  }, false);
}

function arpeggioButton(button, chord) {
  document.querySelector(`.${button}`).addEventListener('click', () => {
    window.playArpeggio(analyser, [
      'c3', 'd3', 'e3', 'f3', 'g3', 'a3', 'b3',
      'c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4',
      'c5', 'd5', 'e5', 'f5', 'g5', 'a5', 'b5', 'c6'
    ]);
  }, false);
}

chordButton('a440', [ 'a4' ]);
chordButton('a880', [ 'a5' ]);
arpeggioButton('scale', [ 'a5' ]);
chordButton('ebmin7', [ 'eb4', 'bb4', 'db5', 'gb5' ]);
chordButton('cmaj7', [ 'c4', 'g4', 'bb4', 'e5' ]);
chordButton('bb7', [ 'd4', 'f4', 'ab4', 'bb4' ]);
