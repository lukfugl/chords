// fork getUserMedia for multiple browser versions, for those that need prefixes
navigator.getUserMedia = (
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

if (!navigator.getUserMedia) {
  throw new Error('getUserMedia not supported on your browser!');
}

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function loadSample(sample, cb) {
  var ajaxRequest = new XMLHttpRequest();
  ajaxRequest.open('GET', `https://raw.githubusercontent.com/lukfugl/chords/master/samples/${sample}.m4a`, true);
  ajaxRequest.responseType = 'arraybuffer';
  ajaxRequest.onload = function() {
    var audioData = ajaxRequest.response;
    audioCtx.decodeAudioData(audioData, function(buffer) {
      var source = audioCtx.createBufferSource();
      source.buffer = buffer;
      cb(source)
    }, function(e){"Error with decoding audio data" + e.err});
  }
  ajaxRequest.send();
}

// set up canvas context for visualizer
var canvas = document.querySelector('.visualizer');
var intendedWidth = document.querySelector('.wrapper').clientWidth;
canvas.setAttribute('width', intendedWidth);
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var canvasCtx = canvas.getContext("2d");
canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -60;
analyser.maxDecibels = -20;
analyser.smoothingTimeConstant = 0.85;
analyser.fftSize = 8192;

var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
var floatArray = new Float32Array(bufferLength);
var binToTone = {
   48 : 'c',   97 : 'c',  121 : 'c',
   26 : 'db',  51 : 'db', 180 : 'db',
   27 : 'd',   54 : 'd',  136 : 'd',
   29 : 'eb', 115 : 'eb', 144 : 'eb',
   30 : 'e',  122 : 'e',  183 : 'e',
   64 : 'f',   97 : 'f',  227 : 'f',
  137 : 'gb', 206 : 'gb', 241 : 'gb',
   72 : 'g',  218 : 'g',  255 : 'g',
   77 : 'ab', 115 : 'ab', 154 : 'ab',
   41 : 'a',   81 : 'a',  122 : 'a',
   43 : 'bb',  86 : 'bb', 173 : 'bb',
   46 : 'b',   91 : 'b',  183 : 'b',
};
var counts = {};
var frames = 0;
var rest = 0;
function draw() {
  analyser.getByteFrequencyData(dataArray);
  analyser.getFloatFrequencyData(floatArray);
  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  var barWidth = (WIDTH / (bufferLength/2 - 1)) * 2.5;
  var barHeight;
  var x = 0;
  var incFrames = false;
  for(var i = 1; i < bufferLength/2; i++) {
    if (dataArray[i] > dataArray[i-1] && dataArray[i] > dataArray[i+1]) {
      if (binToTone[i]) {
        var tone = binToTone[i];
        counts[tone] = counts[tone] || 0;
        counts[tone] += 1;
      }
      incFrames = true;
    }
    barHeight = dataArray[i];
    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
    canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
    x += barWidth + 1;
  }
  if (incFrames) { frames += 1; rest = 0; }
  else { rest += 1; }
  if (rest > 5) { frames = 0; counts = {}; }
  var dominant = Object.values(counts).sort((a,b) => b - a)[0];
  var keys = Object.keys(counts).filter((k) => counts[k] > 10 && (counts[k] / dominant) > 0.4);
  for (var prev of document.querySelectorAll('.key')) {
    if (keys.some((key) => prev.classList.contains(`${key}-key`))) {
      prev.classList.add('played');
    } else {
      prev.classList.remove('played');
    }
  }
  requestAnimationFrame(draw);
}
draw();

window.playSample = function(analyser, sample) {
  loadSample(sample, function(source) {
    analyser.disconnect();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    source.start();
  });
}

window.playChord = function(analyser, chord) {
  analyser.disconnect();
  analyser.minDecibels = -60;
  analyser.maxDecibels = -0;

  var toneFrequencies = {
    'c2'  : 261.626 / 4,
    'cs2' : 277.183 / 4,
    'db2' : 277.183 / 4,
    'd2'  : 293.665 / 4,
    'ds2' : 311.127 / 4,
    'eb2' : 311.127 / 4,
    'e2'  : 329.628 / 4,
    'f2'  : 349.228 / 4,
    'fs2' : 369.994 / 4,
    'gb2' : 369.994 / 4,
    'g2'  : 391.995 / 4,
    'gs2' : 415.305 / 4,
    'ab2' : 415.305 / 4,
    'a2'  : 440.000 / 4,
    'as2' : 466.164 / 4,
    'bb2' : 466.164 / 4,
    'b2'  : 493.884 / 4,

    'c3'  : 261.626 / 2,
    'cs3' : 277.183 / 2,
    'db3' : 277.183 / 2,
    'd3'  : 293.665 / 2,
    'ds3' : 311.127 / 2,
    'eb3' : 311.127 / 2,
    'e3'  : 329.628 / 2,
    'f3'  : 349.228 / 2,
    'fs3' : 369.994 / 2,
    'gb3' : 369.994 / 2,
    'g3'  : 391.995 / 2,
    'gs3' : 415.305 / 2,
    'ab3' : 415.305 / 2,
    'a3'  : 440.000 / 2,
    'as3' : 466.164 / 2,
    'bb3' : 466.164 / 2,
    'b3'  : 493.884 / 2,

    'c4'  : 261.626,
    'cs4' : 277.183,
    'db4' : 277.183,
    'd4'  : 293.665,
    'ds4' : 311.127,
    'eb4' : 311.127,
    'e4'  : 329.628,
    'f4'  : 349.228,
    'fs4' : 369.994,
    'gb4' : 369.994,
    'g4'  : 391.995,
    'gs4' : 415.305,
    'ab4' : 415.305,
    'a4'  : 440.000,
    'as4' : 466.164,
    'bb4' : 466.164,
    'b4'  : 493.884,

    'c5'  : 261.626 * 2,
    'cs5' : 277.183 * 2,
    'db5' : 277.183 * 2,
    'd5'  : 293.665 * 2,
    'ds5' : 311.127 * 2,
    'eb5' : 311.127 * 2,
    'e5'  : 329.628 * 2,
    'f5'  : 349.228 * 2,
    'fs5' : 369.994 * 2,
    'gb5' : 369.994 * 2,
    'g5'  : 391.995 * 2,
    'gs5' : 415.305 * 2,
    'ab5' : 415.305 * 2,
    'a5'  : 440.000 * 2,
    'as5' : 466.164 * 2,
    'bb5' : 466.164 * 2,
    'b5'  : 493.884 * 2,
  };

  var gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.3;
  var i = 0;
  for (var tone of chord) {
    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = toneFrequencies[tone];
    oscillator.start(audioCtx.currentTime + i);
    oscillator.stop(audioCtx.currentTime + chord.length + 3);
    oscillator.connect(gainNode);
    i += 1;
  }

  gainNode.connect(analyser);
  analyser.connect(audioCtx.destination);
}

window.playArpeggio = function(analyser, notes) {
  analyser.disconnect();
  analyser.minDecibels = -60;
  analyser.maxDecibels = -0;

  var toneFrequencies = {
    'c2'  : 261.626 / 4,
    'cs2' : 277.183 / 4,
    'db2' : 277.183 / 4,
    'd2'  : 293.665 / 4,
    'ds2' : 311.127 / 4,
    'eb2' : 311.127 / 4,
    'e2'  : 329.628 / 4,
    'f2'  : 349.228 / 4,
    'fs2' : 369.994 / 4,
    'gb2' : 369.994 / 4,
    'g2'  : 391.995 / 4,
    'gs2' : 415.305 / 4,
    'ab2' : 415.305 / 4,
    'a2'  : 440.000 / 4,
    'as2' : 466.164 / 4,
    'bb2' : 466.164 / 4,
    'b2'  : 493.884 / 4,

    'c3'  : 261.626 / 2,
    'cs3' : 277.183 / 2,
    'db3' : 277.183 / 2,
    'd3'  : 293.665 / 2,
    'ds3' : 311.127 / 2,
    'eb3' : 311.127 / 2,
    'e3'  : 329.628 / 2,
    'f3'  : 349.228 / 2,
    'fs3' : 369.994 / 2,
    'gb3' : 369.994 / 2,
    'g3'  : 391.995 / 2,
    'gs3' : 415.305 / 2,
    'ab3' : 415.305 / 2,
    'a3'  : 440.000 / 2,
    'as3' : 466.164 / 2,
    'bb3' : 466.164 / 2,
    'b3'  : 493.884 / 2,

    'c4'  : 261.626,
    'cs4' : 277.183,
    'db4' : 277.183,
    'd4'  : 293.665,
    'ds4' : 311.127,
    'eb4' : 311.127,
    'e4'  : 329.628,
    'f4'  : 349.228,
    'fs4' : 369.994,
    'gb4' : 369.994,
    'g4'  : 391.995,
    'gs4' : 415.305,
    'ab4' : 415.305,
    'a4'  : 440.000,
    'as4' : 466.164,
    'bb4' : 466.164,
    'b4'  : 493.884,

    'c5'  : 261.626 * 2,
    'cs5' : 277.183 * 2,
    'db5' : 277.183 * 2,
    'd5'  : 293.665 * 2,
    'ds5' : 311.127 * 2,
    'eb5' : 311.127 * 2,
    'e5'  : 329.628 * 2,
    'f5'  : 349.228 * 2,
    'fs5' : 369.994 * 2,
    'gb5' : 369.994 * 2,
    'g5'  : 391.995 * 2,
    'gs5' : 415.305 * 2,
    'ab5' : 415.305 * 2,
    'a5'  : 440.000 * 2,
    'as5' : 466.164 * 2,
    'bb5' : 466.164 * 2,
    'b5'  : 493.884 * 2,

    'c6'  : 261.626 * 4,
  };

  var gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.3;
  var i = 0;
  for (var tone of notes) {
    var oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = toneFrequencies[tone];
    oscillator.start(audioCtx.currentTime + i * 0.2);
    oscillator.stop(audioCtx.currentTime + (i + 0.95) * 0.2);
    oscillator.connect(gainNode);
    i += 1;
  }

  gainNode.connect(analyser);
  analyser.connect(audioCtx.destination);
}

window.analyseMic = function(analyser) {
  navigator.getUserMedia(
    { audio: true },
    function(stream) {
      analyser.disconnect();
      analyser.minDecibels = -70;
      analyser.maxDecibels = -30;
      var source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
    },
    function(err) { throw new Error('The following gUM error occured: ' + err); }
  );
}
