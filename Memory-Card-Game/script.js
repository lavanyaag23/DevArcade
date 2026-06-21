const DIFFICULTY = {
  easy: { pairs: 6, cols: 4 },
  medium: { pairs: 8, cols: 4 },
  hard: { pairs: 12, cols: 6 }
};

const SYMBOL_POOL = ['🍓', '🍎', '🍌', '🍇', '🍒', '🍋', '🍑', '🍍', '🥝', '🍉', '🍐', '🥭'];
const STORAGE_KEY = 'memoryBest_v1';

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const bestStatEl = document.getElementById('bestStat');
const diffButtons = document.querySelectorAll('.diff-btn');
const restartBtn = document.getElementById('restartBtn');
const winOverlay = document.getElementById('winOverlay');
const winMovesEl = document.getElementById('winMoves');
const winTimeEl = document.getElementById('winTime');
const newBestTag = document.getElementById('newBestTag');
const playAgainBtn = document.getElementById('playAgainBtn');

let bestRecords = loadBest();
let currentDiff = 'easy';
let cards = [];
let flipped = [];
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;
let lock = false;
let started = false;
let timerInterval = null;
let elapsedSeconds = 0;
let audioCtx = null;

initGame('easy');

diffButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.diff === currentDiff) return;
    diffButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    initGame(btn.dataset.diff);
  });
});

restartBtn.addEventListener('click', () => initGame(currentDiff));
playAgainBtn.addEventListener('click', () => {
  hideOverlay(winOverlay);
  initGame(currentDiff);
});

function loadBest() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

function saveBest() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bestRecords));
}

function initGame(difficulty) {
  currentDiff = difficulty;
  const config = DIFFICULTY[difficulty];
  totalPairs = config.pairs;
  matchedPairs = 0;
  moves = 0;
  flipped = [];
  lock = false;
  started = false;
  elapsedSeconds = 0;

  clearInterval(timerInterval);
  movesEl.textContent = '0';
  timerEl.textContent = '00:00';
  updateBestDisplay();

  const symbols = SYMBOL_POOL.slice(0, config.pairs);
  const deck = shuffle([...symbols, ...symbols]).map((symbol, i) => ({
    id: i,
    symbol,
    flipped: false,
    matched: false
  }));
  cards = deck;

  board.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
  renderBoard();
  hideOverlay(winOverlay);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderBoard() {
  board.innerHTML = '';
  cards.forEach(card => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.id = card.id;
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">✦</div>
        <div class="card-face card-front">${card.symbol}</div>
      </div>
    `;
    el.addEventListener('click', () => onCardClick(card.id, el));
    board.appendChild(el);
  });
}

function onCardClick(id, el) {
  if (lock) return;
  const card = cards.find(c => c.id === id);
  if (!card || card.flipped || card.matched) return;

  if (!started) {
    started = true;
    startTimer();
  }

  card.flipped = true;
  el.classList.add('flipped');
  soundFlip();
  flipped.push({ card, el });

  if (flipped.length === 2) {
    moves++;
    bumpUpdate(movesEl, moves);
    lock = true;
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flipped;
  if (a.card.symbol === b.card.symbol) {
    a.card.matched = true;
    b.card.matched = true;
    a.el.classList.add('matched');
    b.el.classList.add('matched');
    matchedPairs++;
    soundMatch();
    flipped = [];
    lock = false;
    if (matchedPairs === totalPairs) {
      finishGame();
    }
  } else {
    a.el.classList.add('mismatch');
    b.el.classList.add('mismatch');
    soundMismatch();
    setTimeout(() => {
      a.card.flipped = false;
      b.card.flipped = false;
      a.el.classList.remove('flipped', 'mismatch');
      b.el.classList.remove('flipped', 'mismatch');
      flipped = [];
      lock = false;
    }, 750);
  }
}

function finishGame() {
  clearInterval(timerInterval);
  soundWin();

  const prev = bestRecords[currentDiff];
  const isNewBest = !prev || moves < prev.moves || (moves === prev.moves && elapsedSeconds < prev.time);
  if (isNewBest) {
    bestRecords[currentDiff] = { moves, time: elapsedSeconds };
    saveBest();
  }

  winMovesEl.textContent = moves;
  winTimeEl.textContent = formatTime(elapsedSeconds);
  newBestTag.classList.toggle('hidden', !isNewBest);
  updateBestDisplay();

  setTimeout(() => {
    showOverlay(winOverlay);
    burstConfetti();
  }, 400);
}

function startTimer() {
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    timerEl.textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateBestDisplay() {
  const rec = bestRecords[currentDiff];
  bestStatEl.textContent = rec ? `${rec.moves}` : '--';
}

function bumpUpdate(el, value) {
  el.textContent = value;
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

function playTone(freqs, duration = 0.1) {
  try {
    const ctx = getAudioCtx();
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.07, ctx.currentTime + i * duration);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * duration);
      osc.stop(ctx.currentTime + (i + 1) * duration);
    });
  } catch (e) {}
}

function soundFlip() { playTone([520], 0.06); }
function soundMatch() { playTone([660, 880]); }
function soundMismatch() { playTone([300, 220]); }
function soundWin() { playTone([523, 659, 784, 1047], 0.13); }

function burstConfetti() {
  const colors = ['#c084fc', '#a855f7', '#34d399', '#fbbf24'];
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight / 3;

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'confetti';
    p.style.background = colors[i % colors.length];
    p.style.left = originX + 'px';
    p.style.top = originY + 'px';
    document.body.appendChild(p);

    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 180;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 60;
    const rot = Math.random() * 540;

    p.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)' });

    setTimeout(() => p.remove(), 1300);
  }
}