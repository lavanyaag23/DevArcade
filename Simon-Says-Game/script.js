const COLORS = ['red', 'green', 'blue', 'yellow'];
const TONES = { red: 330, green: 392, blue: 494, yellow: 587 };
const STORAGE_KEY = 'simonBestLevel_v1';

const levelStat = document.getElementById('levelStat');
const bestStatEl = document.getElementById('bestStat');
const statusText = document.getElementById('statusText');
const startBtn = document.getElementById('startBtn');
const padGrid = document.getElementById('padGrid');
const centerBadge = document.getElementById('centerBadge');
const endOverlay = document.getElementById('endOverlay');
const finalLevelEl = document.getElementById('finalLevel');
const newBestTag = document.getElementById('newBestTag');
const playAgainBtn = document.getElementById('playAgainBtn');
const pads = document.querySelectorAll('.pad');

let best = Number(localStorage.getItem(STORAGE_KEY)) || 0;
let sequence = [];
let level = 1;
let playerIndex = 0;
let acceptingInput = false;
let running = false;
let audioCtx = null;

bestStatEl.textContent = best || '--';

startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', () => {
  hideOverlay(endOverlay);
  startGame();
});

pads.forEach(pad => {
  pad.addEventListener('click', () => onPadClick(pad.dataset.color, pad));
});

function startGame() {
  running = true;
  sequence = [];
  level = 1;
  playerIndex = 0;
  acceptingInput = false;
  startBtn.disabled = true;
  hideOverlay(endOverlay);
  addStep();
  updateLevelDisplay();
  playSequence();
}

function addStep() {
  sequence.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
}

function playSequence() {
  acceptingInput = false;
  playerIndex = 0;
  setStatus('Watch the pattern...', true);
  setPadsEnabled(false);

  const stepDelay = Math.max(280, 600 - level * 15);
  const litDuration = Math.max(200, stepDelay - 150);
  let i = 0;

  function step() {
    if (i >= sequence.length) {
      acceptingInput = true;
      setPadsEnabled(true);
      setStatus('Your turn!', true);
      return;
    }
    litPad(sequence[i], litDuration);
    i++;
    setTimeout(step, stepDelay);
  }

  setTimeout(step, 600);
}

function litPad(color, duration) {
  const pad = [...pads].find(p => p.dataset.color === color);
  pad.classList.add('lit');
  playTone(TONES[color], 0.001, duration / 1000 - 0.02);
  setTimeout(() => pad.classList.remove('lit'), duration);
}

function onPadClick(color, pad) {
  if (!acceptingInput || !running) return;

  pad.classList.add('lit');
  playTone(TONES[color], 0.001, 0.18);
  setTimeout(() => pad.classList.remove('lit'), 220);

  if (color === sequence[playerIndex]) {
    playerIndex++;
    if (playerIndex === sequence.length) {
      acceptingInput = false;
      setPadsEnabled(false);
      level++;
      updateLevelDisplay();
      setStatus('Level up!', true);
      setTimeout(() => {
        addStep();
        playSequence();
      }, 900);
    }
  } else {
    triggerGameOver();
  }
}

function triggerGameOver() {
  running = false;
  acceptingInput = false;
  setPadsEnabled(false);
  padGrid.classList.add('shake');
  soundGameOver();
  setTimeout(() => padGrid.classList.remove('shake'), 400);

  const reachedLevel = level;
  const isNewBest = reachedLevel > best;
  if (isNewBest) {
    best = reachedLevel;
    localStorage.setItem(STORAGE_KEY, String(best));
  }

  finalLevelEl.textContent = reachedLevel;
  newBestTag.classList.toggle('hidden', !isNewBest);
  bestStatEl.textContent = best || '--';
  setStatus('Game Over', false);
  startBtn.disabled = false;

  setTimeout(() => showOverlay(endOverlay), 500);
}

function updateLevelDisplay() {
  levelStat.textContent = level;
  centerBadge.textContent = level;
  bumpUpdate(levelStat);
  centerBadge.classList.remove('pulse');
  void centerBadge.offsetWidth;
  centerBadge.classList.add('pulse');
}

function setStatus(text, active) {
  statusText.textContent = text;
  statusText.classList.toggle('active', active);
}

function setPadsEnabled(enabled) {
  pads.forEach(p => (p.disabled = !enabled));
}

function bumpUpdate(el) {
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function showOverlay(el) { el.classList.remove('hidden'); }
function hideOverlay(el) { el.classList.add('hidden'); }

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, startOffset = 0, duration = 0.2) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
    gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + startOffset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startOffset);
    osc.stop(ctx.currentTime + startOffset + duration + 0.02);
  } catch (e) {}
}

function soundGameOver() {
  try {
    const ctx = getAudioCtx();
    [220, 196, 174, 130].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + (i + 1) * 0.12);
    });
  } catch (e) {}
}