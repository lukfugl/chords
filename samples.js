function sampleButton(sample) {
  var el = document.querySelector(`.${sample}`);
  if (!el) return;
  el.addEventListener('click', () => {
    window.playSample(analyser, sample);
  }, false);
}

sampleButton('bb7');
sampleButton('c-minor7');
sampleButton('chromatic');
sampleButton('d-major');
sampleButton('db6');
sampleButton('major-scale');
sampleButton('octaves-of-c');
sampleButton('progression');
