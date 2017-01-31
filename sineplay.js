document.querySelector('.ebmin7').onclick(() => {
  window.playChord(analyser, [ 'eb4', 'bb4', 'db5', 'gb5' ]);
});

document.querySelector('.c7').onclick(() => {
  window.playChord(analyser, [ 'c4', 'e4', 'g4', 'bb4' ]);
});

document.querySelector('.scale').onclick(() => {
  playArpeggio(analyser, [
    'c3', 'd3', 'e3', 'f3', 'g3', 'a3', 'b3',
    'c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4',
    'c5', 'd5', 'e5', 'f5', 'g5', 'a5', 'b5', 'c6'
  ]);
});
