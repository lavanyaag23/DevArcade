const STORAGE_KEY = '2048_best_v1';
const SIZE = 4;

// ── DOM ──
const scoreEl     = document.getElementById('score');
const bestEl      = document.getElementById('best');
const tilesLayer  = document.getElementById('tilesLayer');
const newGameBtn  = document.getElementById('newGameBtn');
const winOverlay  = document.getElementById('winOverlay');
const loseOverlay = document.getElementById('loseOverlay');
const finalScoreEl = document.getElementById('finalScore');
const keepGoingBtn = document.getElementById('keepGoingBtn');
const winNewBtn   = document.getElementById('winNewBtn');
const loseNewBtn  = document.getElementById('loseNewBtn');

// ── STATE ──
let grid    = [];   // 4×4 matrix of values (0 = empty)
let score   = 0;
let best    = Number(localStorage.getItem(STORAGE_KEY)) || 0;
let won     = false;
let over    = false;
let moving  = false;
let audioCtx = null;

bestEl.textContent = best;

// ── INIT ──
newGame();

newGameBtn.addEventListener('click', newGame);
keepGoingBtn.addEventListener('click', () => { won = true; hideOverlay(winOverlay); });
winNewBtn.addEventListener('click', newGame);
loseNewBtn.addEventListener('click', newGame);

function newGame() {
  grid  = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  score = 0;
  won   = false;
  over  = false;
  moving = false;
  scoreEl.textContent = '0';
  hideOverlay(winOverlay);
  hideOverlay(loseOverlay);
  addTile();
  addTile();
  renderBoard();
}

// ── TILE MANAGEMENT ──
function addTile() {
  const empty = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] === 0) empty.push([r, c]);
  if (!empty.length) return false;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return [r, c];
}

// ── RENDER ──
// We re-render from scratch each move for simplicity + clean animation
function renderBoard(newPos = null, mergePos = []) {
  tilesLayer.innerHTML = '';
  const tileSize = computeTileSize();

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const val = grid[r][c];
      if (!val) continue;
      const tile = document.createElement('div');
      tile.className = 'tile';

      // position
      const { top, left, size } = getTileMetrics(r, c, tileSize);
      tile.style.width  = size + 'px';
      tile.style.height = size + 'px';
      tile.style.top    = top  + 'px';
      tile.style.left   = left + 'px';

      tile.dataset.val = val <= 2048 ? val : 'super';
      tile.textContent = val;

      // animation class
      if (newPos && newPos[0] === r && newPos[1] === c) {
        tile.classList.add('new');
      } else if (mergePos.some(([mr, mc]) => mr === r && mc === c)) {
        tile.classList.add('merge');
      }

      tilesLayer.appendChild(tile);
    }
  }
}

function computeTileSize() {
  const boardEl = document.getElementById('board');
  const inner = boardEl.clientWidth - 20; // 10px padding each side
  const gap = 10;
  return (inner - gap * (SIZE - 1)) / SIZE;
}

function getTileMetrics(r, c, tileSize) {
  const gap = 10;
  return {
    top:  r * (tileSize + gap),
    left: c * (tileSize + gap),
    size: tileSize
  };
}

// ── MOVE LOGIC ──
// direction: 'up' | 'down' | 'left' | 'right'
function move(dir) {
  if (over || moving) return;

  const prev = grid.map(row => [...row]);
  const mergePositions = [];
  let gained = 0;

  // Rotate grid so we always merge "left" then rotate back
  const rotations = { left: 0, up: 1, right: 2, down: 3 };
  let g = deepClone(grid);
  const times = rotations[dir];
  for (let i = 0; i < times; i++) g = rotateLeft(g);

  // slide each row left
  for (let r = 0; r < SIZE; r++) {
    const result = slideLeft(g[r]);
    g[r] = result.row;
    gained += result.gained;
    result.merges.forEach(c => {
      // track merge col in rotated space, will re-map after
      mergePositions.push([r, c, times]);
    });
  }

  // rotate back
  const backTimes = (4 - times) % 4;
  for (let i = 0; i < backTimes; i++) g = rotateLeft(g);

  // map merge positions back
  const realMerges = mergePositions.map(([r, c, rot]) => {
    return rotateBack(r, c, rot);
  });

  if (!gridsEqual(prev, g)) {
    moving = true;
    grid = g;
    score += gained;
    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      localStorage.setItem(STORAGE_KEY, String(best));
    }
    bumpUpdate(scoreEl);

    // spawn a new tile
    const newPos = addTile();
    soundMove();
    if (gained > 0) soundMerge(gained);

    renderBoard(newPos || null, realMerges);

    setTimeout(() => {
      moving = false;
      if (!won && hasValue(2048)) {
        won = true;
        soundWin();
        showOverlay(winOverlay);
      } else if (!canMove()) {
        over = true;
        finalScoreEl.textContent = score;
        soundLose();
        showOverlay(loseOverlay);
      }
    }, 150);
  }
}

function slideLeft(row) {
  let arr = row.filter(v => v !== 0);
  const merges = [];
  let gained = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      gained += arr[i];
      arr.splice(i + 1, 1);
      merges.push(i);
    }
  }

  while (arr.length < SIZE) arr.push(0);
  return { row: arr, gained, merges };
}

function rotateLeft(g) {
  const n = g.length;
  return Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => g[c][n - 1 - r])
  );
}

function rotateBack(r, c, rot) {
  // apply (4-rot) left rotations = rot right rotations
  let rr = r, rc = c;
  const times = (4 - rot) % 4;
  for (let i = 0; i < times; i++) {
    [rr, rc] = [rc, SIZE - 1 - rr];
  }
  return [rr, rc];
}

function gridsEqual(a, b) {
  return a.every((row, r) => row.every((val, c) => val === b[r][c]));
}

function deepClone(g) {
  return g.map(row => [...row]);
}

function hasValue(v) {
  return grid.some(row => row.includes(v));
}

function canMove() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

// ── CONTROLS ──
document.addEventListener('keydown', e => {
  const map = {
    ArrowLeft: 'left',  a: 'left',  A: 'left',
    ArrowRight:'right', d: 'right', D: 'right',
    ArrowUp:   'up',    w: 'up',    W: 'up',
    ArrowDown: 'down',  s: 'down',  S: 'down'
  };
  const dir = map[e.key];
  if (!dir) return;
  e.preventDefault();
  move(dir);
});

// swipe support
let touchStartX = 0, touchStartY = 0;
const boardEl = document.getElementById('board');

boardEl.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

boardEl.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const absDx = Math.abs(dx), absDy = Math.abs(dy);
  if (Math.max(absDx, absDy) < 20) return;
  if (absDx > absDy) move(dx > 0 ? 'right' : 'left');
  else               move(dy > 0 ? 'down'  : 'up');
}, { passive: true });

// ── UTILS ──
function bumpUpdate(el) {
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function showOverlay(el) { el.classList.remove('hidden'); }
function hideOverlay(el) { el.classList.add('hidden'); }

// ── AUDIO ──
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, dur = 0.08, type = 'sine', vol = 0.06) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch {}
}

function soundMove()  { playTone(220, 0.05, 'sine', 0.04); }
function soundMerge(val) {
  const freqMap = {
    4:4, 8:8, 16:16, 32:32, 64:64, 128:128,
    256:256, 512:512, 1024:1024, 2048:2048
  };
  // map merge value to a pleasant frequency 300-900
  const f = Math.min(900, 280 + Math.log2(val || 4) * 40);
  playTone(f, 0.12, 'sine', 0.07);
}
function soundWin()  {
  [523, 659, 784, 1047].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.18, 'sine', 0.08), i * 120)
  );
}
function soundLose() {
  [400, 320, 240, 180].forEach((f, i) =>
    setTimeout(() => playTone(f, 0.15, 'sine', 0.06), i * 120)
  );
}

// ── RESIZE HANDLER ──
// Re-render tiles on resize so positions stay correct
window.addEventListener('resize', () => renderBoard());