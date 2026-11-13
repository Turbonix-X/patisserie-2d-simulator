/* ============================================
   PATISSERIE 2D SIMULATOR - MUSIQUE ET SONS
   Tout est joue en direct (Web Audio) : aucune piste
   a telecharger. Chaque morceau a une melodie ecrite,
   des accords et une basse.
   ============================================ */

// melody : une note par temps ou demi-temps selon "step". '-' prolonge, '.' silence.
// chords : un accord par mesure.
var MUSIC_TRACKS = [
  { id:'default', name:'Douce Mélodie', unlockLvl:0, bpm:92, beats:4, step:0.5, wave:'triangle',
    chords:['C','Am','F','G','C','Em','F','G'],
    melody:'e5 - g5 - a5 g5 e5 - | d5 - e5 c5 a4 - c5 - | f5 - a5 - c6 a5 f5 - | g5 - b5 a5 g5 - d5 - | e5 - g5 - c6 b5 g5 - | b4 - e5 g5 b5 - g5 - | a5 g5 f5 e5 d5 - f5 - | e5 d5 c5 d5 g4 - - .' },
  { id:'waltz', name:'Valse Sucrée', unlockLvl:0, bpm:132, beats:3, step:1, wave:'triangle',
    chords:['F','C','Dm','Bb','F','C','Bb','C'],
    melody:'a5 c6 a5 | g5 e5 g5 | f5 a5 d6 | d6 - bb5 | a5 c6 f6 | e6 c6 g5 | bb5 a5 g5 | g5 - .' },
  { id:'joy', name:'Joie Pâtissière', unlockLvl:0, bpm:124, beats:4, step:0.5, wave:'square',
    chords:['G','D','Em','C','G','D','C','D'],
    melody:'g5 b5 d6 b5 g5 - a5 b5 | a5 f#5 d5 f#5 a5 - d6 - | b5 g5 e5 g5 b5 - c6 b5 | a5 - g5 e5 c5 e5 g5 - | d6 - b5 - g5 a5 b5 d6 | f#5 a5 d6 c6 a5 - f#5 - | g5 a5 b5 c6 e6 - c6 - | d6 c6 b5 a5 f#5 - - .' },
  { id:'calm', name:'Douceur du Soir', unlockLvl:0, bpm:66, beats:4, step:1, wave:'sine',
    chords:['Am','F','C','G','Am','Dm','F','E'],
    melody:'e5 c5 a4 c5 | a4 c5 f5 e5 | g5 e5 c5 e5 | d5 - b4 - | c5 e5 a5 g5 | f5 d5 a4 d5 | c5 f5 a5 c6 | b5 - g#5 .' },
  { id:'oven', name:'Rythme du Four', unlockLvl:5, bpm:108, beats:4, step:0.5, wave:'triangle',
    chords:['Dm','Bb','F','C','Dm','Gm','A','A'],
    melody:'d5 f5 a5 f5 d6 - a5 - | bb5 a5 g5 f5 d5 - f5 - | c6 a5 f5 a5 c6 - f6 - | e6 d6 c6 g5 e5 - g5 - | a5 d6 f6 d6 a5 - d5 - | g5 bb5 d6 bb5 g5 - bb5 a5 | a5 c#6 e6 c#6 a5 - e5 - | a5 - c#6 - e6 - . .' },
  { id:'night', name:'Nuit de Crème', unlockLvl:15, bpm:76, beats:4, step:0.5, wave:'sine',
    chords:['Em','C','G','D','Em','Am','C','B'],
    melody:'b5 - g5 e5 b4 - e5 g5 | c6 - g5 e5 c5 - e5 - | d6 - b5 g5 d5 - g5 b5 | a5 - f#5 d5 a4 - d5 - | g5 b5 e6 b5 g5 - e5 - | a5 c6 e6 c6 a5 - c5 - | e5 g5 c6 g5 e5 g5 c6 e6 | d#6 - b5 f#5 d#5 - - .' },
  { id:'spring', name:'Valse des Fleurs', unlockLvl:0, season:'spring', bpm:138, beats:3, step:1, wave:'triangle',
    chords:['D','G','A','D','Bm','G','A','D'],
    melody:'f#5 a5 d6 | b5 g5 d5 | c#6 a5 e5 | f#5 - d5 | d6 b5 f#5 | b5 g5 e5 | a5 g5 e5 | d5 - .' },
  { id:'summer', name:'Vagues Douces', unlockLvl:0, season:'summer', bpm:112, beats:4, step:0.5, wave:'triangle',
    chords:['A','F#m','D','E','A','C#m','D','E'],
    melody:'c#6 - a5 e5 a5 c#6 e6 - | f#5 a5 c#6 a5 f#5 - c#5 - | d5 f#5 a5 d6 a5 - f#5 - | e5 g#5 b5 e6 b5 - g#5 - | a5 - c#6 e6 a6 - e6 - | c#6 e6 g#5 e5 c#5 - e5 - | d6 c#6 b5 a5 f#5 a5 d6 - | b5 - g#5 - e5 - - .' },
  { id:'fall', name:'Feuilles de Caramel', unlockLvl:0, season:'fall', bpm:84, beats:4, step:0.5, wave:'triangle',
    chords:['Am','Dm','G','C','F','Dm','E','Am'],
    melody:'a5 - e5 c5 a4 c5 e5 - | d5 f5 a5 f5 d5 - a4 - | b4 d5 g5 d5 b5 - g5 - | c6 - g5 e5 c5 e5 g5 - | a5 c6 f6 c6 a5 - f5 - | f5 a5 d6 a5 f5 - d5 - | g#5 b5 e6 b5 g#5 - e5 - | a5 - - e5 a4 - - .' },
  { id:'winter', name:'Sucre Glace', unlockLvl:0, season:'winter', bpm:72, beats:3, step:0.5, wave:'sine',
    chords:['Em','Am','C','B','Em','G','Am','B'],
    melody:'e6 b5 g5 b5 e5 g5 | a5 c6 e6 c6 a5 e5 | g5 c6 e6 g6 e6 c6 | b5 d#6 f#6 d#6 b5 f#5 | g5 b5 e6 g6 e6 b5 | d6 b5 g5 b5 d6 g6 | e6 c6 a5 c6 e6 a6 | f#6 d#6 b5 - - .' },
  { id:'birthday', name:'Joyeux Anniversaire', unlockLvl:0, birthday:true, bpm:112, beats:3, step:1, wave:'triangle',
    chords:['C','C','G','G','C','C','F','C','G','C'],
    melody:'. . g4 | g4 a4 g4 | c5 b4 g4 | g4 a4 g4 | d5 c5 g4 | g4 g5 e5 | c5 b4 a4 | f5 f5 e5 | c5 d5 c5 | - - .' },
  { id:'zen', name:'Jardin Zen', unlockLvl:100, bpm:70, beats:4, step:0.5, wave:'sine',
    chords:['C','Am','F','G','C','Am','Dm','G'],
    melody:'e5 - g5 - a5 - g5 - | e5 - c5 - a4 - c5 - | f5 - a5 - c6 - a5 - | g5 - d5 - b4 - d5 - | e5 - g5 - c6 - g5 - | a5 - e5 - c5 - e5 - | d5 - f5 - a5 - f5 - | g5 - b4 - c5 - - .' },
  { id:'jazz', name:'Café Jazz', unlockLvl:300, bpm:104, beats:4, step:0.5, wave:'triangle',
    chords:['Dm','G','C','Am','Dm','G','C','C'],
    melody:'f5 - a5 g5 f5 - d5 - | g5 - b5 a5 g5 - d5 - | e5 - g5 e5 c5 - e5 - | a4 - c5 e5 a5 - e5 - | f5 a5 d6 - c6 a5 f5 - | g5 b5 d6 - b5 g5 d5 - | e5 g5 c6 b5 g5 e5 c5 - | c5 - e5 - g5 - - .' },
  { id:'epic', name:'Four Sacré', unlockLvl:500, bpm:96, beats:4, step:0.5, wave:'square',
    chords:['Am','F','C','G','Am','F','G','E'],
    melody:'a5 - - c6 e6 - c6 - | a5 - - c6 f6 - c6 - | g5 - - c6 e6 - c6 - | g5 - b5 d6 g6 - d6 - | e6 - - c6 a5 - c6 - | f6 - e6 c6 a5 - f5 - | d6 - b5 g5 d6 - b5 - | g#5 - b5 - e6 - - .' },
  { id:'lullaby', name:'Berceuse Étoilée', unlockLvl:700, bpm:58, beats:3, step:1, wave:'sine',
    chords:['G','Em','C','D','G','Em','Am','D'],
    melody:'b5 g5 d5 | e5 g5 b5 | c6 b5 g5 | f#5 a5 d6 | b5 d6 g6 | e6 b5 g5 | c6 a5 e5 | d5 - .' },
  { id:'finale', name:'Grand Gâteau', unlockLvl:900, bpm:128, beats:4, step:0.5, wave:'triangle',
    chords:['D','A','Bm','G','D','A','G','A'],
    melody:'f#5 a5 d6 - f#6 - d6 - | e6 - c#6 a5 e6 - a5 - | d6 - f#6 - b5 - d6 - | b5 d6 g6 - d6 b5 g5 - | f#6 d6 a5 d6 f#6 - a6 - | e6 c#6 a5 c#6 e6 - a5 - | d6 b5 g5 b5 d6 - g6 - | a5 c#6 e6 - a6 - - .' },
];

var NOTE_INDEX = { c:0, 'c#':1, db:1, d:2, 'd#':3, eb:3, e:4, f:5, 'f#':6, gb:6, g:7, 'g#':8, ab:8, a:9, 'a#':10, bb:10, b:11 };

function noteFreq(name) {
  var m = name.match(/^([a-g][#b]?)(\d)$/);
  if (!m) return 0;
  return 440 * Math.pow(2, (NOTE_INDEX[m[1]] + (parseInt(m[2], 10) + 1) * 12 - 69) / 12);
}

function chordNotes(chord) {
  var m = chord.match(/^([A-G])([#b]?)(m?)$/);
  var root = NOTE_INDEX[(m[1] + m[2]).toLowerCase()];
  return { root: root, third: root + (m[3] ? 3 : 4), fifth: root + 7 };
}

function midiFreq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

// ============ MOTEUR ============
var audioCtx = null;
var musicGain = null;
var musicEcho = null;
var musicPlaying = false;
var musicTimer = null;
var musicPos = { bar: 0, nextTime: 0, events: [], idx: 0 };

function getAudio() {
  if (!audioCtx) {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function initMusicGraph() {
  var ctx = getAudio();
  if (!ctx || musicGain) return ctx;
  musicGain = ctx.createGain();
  musicGain.connect(ctx.destination);
  // Un petit echo pour donner de l'espace
  musicEcho = ctx.createDelay(1);
  musicEcho.delayTime.value = 0.28;
  var feedback = ctx.createGain();
  feedback.gain.value = 0.28;
  var wet = ctx.createGain();
  wet.gain.value = 0.3;
  musicEcho.connect(feedback);
  feedback.connect(musicEcho);
  musicEcho.connect(wet);
  wet.connect(musicGain);
  applyMusicVolume();
  return ctx;
}

function applyMusicVolume() {
  if (musicGain) musicGain.gain.value = (G.settings.musicVolume / 100) * 0.5;
}

function getCurrentTrack() {
  for (var i = 0; i < MUSIC_TRACKS.length; i++) {
    if (MUSIC_TRACKS[i].id === G.settings.musicTrack) return MUSIC_TRACKS[i];
  }
  return MUSIC_TRACKS[0];
}

function trackAvailable(track) {
  if (G.level < track.unlockLvl) return false;
  if (track.season) return !!G.creative || !!(G.unlockedThemes && G.unlockedThemes[track.season]) || currentSeason() === track.season;
  if (track.birthday) return !!G.creative || !!(G.unlockedThemes && G.unlockedThemes.birthday) || isBirthdayToday();
  return true;
}

function playTone(freq, when, dur, wave, peak, toEcho) {
  var ctx = audioCtx;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(gain);
  gain.connect(musicGain);
  if (toEcho && musicEcho) gain.connect(musicEcho);
  osc.start(when);
  osc.stop(when + dur + 0.02);
}

// Prepare une mesure : melodie, basse et accord
function scheduleBar(track, barIdx, when) {
  var beat = 60 / track.bpm;
  var barLen = beat * track.beats;
  var bars = track.melody.split('|');
  var notes = bars[barIdx % bars.length].trim().split(/\s+/);
  var step = beat * track.step;
  for (var i = 0; i < notes.length; i++) {
    var n = notes[i];
    if (n === '-' || n === '.') continue;
    var hold = 1;
    while (i + hold < notes.length && notes[i + hold] === '-') hold++;
    var dur = Math.max(0.25, step * hold * 1.5);
    var t0 = when + step * i;
    var wave = track.wave === 'square' ? 'triangle' : track.wave;
    playTone(noteFreq(n), t0, dur, wave, 0.2, true);
    // Une octave douce au-dessus : effet boite a musique
    playTone(noteFreq(n) * 2, t0, dur * 0.6, 'sine', 0.05, true);
  }
  var c = chordNotes(track.chords[barIdx % track.chords.length]);
  // Basse
  playTone(midiFreq(36 + c.root), when, beat * 1.4, 'sine', 0.2, false);
  if (track.beats === 4) playTone(midiFreq(36 + c.root + 7), when + beat * 2, beat * 1.2, 'sine', 0.13, false);
  // Accords : plaques en valse, arpege sinon
  var chord = [c.root, c.third, c.fifth];
  if (track.beats === 3) {
    for (var b = 1; b < 3; b++) {
      chord.forEach(function(semi) { playTone(midiFreq(60 + semi), when + beat * b, beat * 0.8, 'triangle', 0.035, false); });
    }
  } else {
    for (var a = 0; a < track.beats * 2; a++) {
      playTone(midiFreq(60 + chord[a % 3]), when + (beat / 2) * a, beat * 0.9, 'sine', 0.035, false);
    }
  }
  return barLen;
}

function musicScheduler() {
  if (!musicPlaying || !audioCtx) return;
  var track = getCurrentTrack();
  while (musicPos.nextTime < audioCtx.currentTime + 0.5) {
    musicPos.nextTime += scheduleBar(track, musicPos.bar, musicPos.nextTime);
    musicPos.bar++;
  }
}

function startMusic() {
  var ctx = initMusicGraph();
  if (!ctx) return;
  if (!trackAvailable(getCurrentTrack())) G.settings.musicTrack = 'default';
  musicPlaying = true;
  musicPos.bar = 0;
  musicPos.nextTime = ctx.currentTime + 0.1;
  if (!musicTimer) musicTimer = setInterval(musicScheduler, 150);
  musicScheduler();
}

function stopMusic() {
  musicPlaying = false;
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
}

function toggleMusic() {
  G.settings.music = !G.settings.music;
  if (G.settings.music) startMusic();
  else stopMusic();
}

function setMusicTrack(trackId) {
  G.settings.musicTrack = trackId;
  if (musicPlaying) { stopMusic(); startMusic(); }
}

function setMusicVolume(val) {
  G.settings.musicVolume = parseInt(val, 10);
  applyMusicVolume();
}

// Les navigateurs interdisent le son avant la premiere action du joueur
function armMusicAutostart() {
  function go() {
    document.removeEventListener('pointerdown', go, true);
    document.removeEventListener('keydown', go, true);
    if (G.settings.music && !musicPlaying) startMusic();
  }
  document.addEventListener('pointerdown', go, true);
  document.addEventListener('keydown', go, true);
}

// ============ BRUITAGES ============
function playSound(freq, duration, type, when, volume) {
  if (!G.settings.soundEnabled) return;
  var ctx = getAudio();
  if (!ctx) return;
  var t0 = ctx.currentTime + (when || 0);
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume || 0.12, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.start(t0);
  osc.stop(t0 + duration);
}

function playClickSound() { playSound(800, 0.05, 'triangle'); }
function playErrorSound() { playSound(180, 0.14, 'sawtooth', 0, 0.06); }
function playSellSound() { playSound(660, 0.1, 'sine'); playSound(990, 0.14, 'sine', 0.07); }
function playSuccessSound() { playSound(523, 0.12, 'triangle'); playSound(659, 0.12, 'triangle', 0.1); playSound(784, 0.22, 'triangle', 0.2); }
function playFanfare() { [523, 659, 784, 1047, 784, 1047, 1319].forEach(function(f, i) { playSound(f, 0.25, 'triangle', i * 0.13, 0.13); }); }
