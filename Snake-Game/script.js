const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID = 20;
const CELL = canvas.width / GRID;

const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('bestScore');
const finalScoreEl = document.getElementById('finalScore');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const dpadButtons = document.querySelectorAll('.dpad-btn');

const STORAGE_KEY = 'snakeBestScore_v1';
const BASE_SPEED = 140;
const MIN_SPEED = 65;

let snake, direction, nextDirection, food, score, best, speed, gameInterval, started, running;
let audioCtx = null;

best = Number(localStorage.getItem(STORAGE_KEY)) || 0;
bestScoreEl.textContent = best;

initGame();

function initGame() {
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  speed = BASE_SPEED;
  started = false;
  running = false;
  scoreEl.textContent = '0';
  clearInterval(gameInterval);
  placeFood();
  draw();
  showOverlay(startOverlay);
  hideOverlay(gameOverOverlay);
}

function placeFood() {
  let valid = false;
  while (!valid) {
    food = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID)
    };
    valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
  }
}

function startGame() {
  if (started) return;
  started = true;
  running = true;
  hideOverlay(startOverlay);
  gameInterval = setInterval(tick, speed);
}

function tick() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  const hitWall = head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID;
  const hitSelf = snake.some(seg => seg.x === head.x && seg.y === head.y);

  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    soundEat();
    placeFood();
    maybeSpeedUp();
  } else {
    snake.pop();
  }

  draw();
}

function maybeSpeedUp() {
  if (speed > MIN_SPEED && score % 50 === 0) {
    speed -= 8;
    clearInterval(gameInterval);
    gameInterval = setInterval(tick, speed);
  }
}

function endGame() {
  running = false;
  clearInterval(gameInterval);
  soundGameOver();

  if (score > best) {
    best = score;
    localStorage.setItem(STORAGE_KEY, String(best));
    bestScoreEl.textContent = best;
  }

  finalScoreEl.textContent = score;
  showOverlay(gameOverOverlay);
}

function showOverlay(el) { el.classList.remove('hidden'); }
function hideOverlay(el) { el.classList.add('hidden'); }

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // food
  ctx.save();
  ctx.shadowColor = '#fb7185';
  ctx.shadowBlur = 16;
  ctx.fillStyle = '#fb7185';
  roundRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6, 6);
  ctx.fill();
  ctx.restore();

  // snake
  snake.forEach((seg, i) => {
    const isHead = i === 0;
    ctx.save();
    ctx.shadowColor = isHead ? '#c084fc' : 'rgba(168,85,247,0.5)';
    ctx.shadowBlur = isHead ? 18 : 6;
    const fade = Math.max(0.45, 1 - i * 0.035);
    ctx.fillStyle = isHead ? '#c084fc' : `rgba(168,85,247,${fade})`;
    roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 5);
    ctx.fill();
    ctx.restore();
  });
}

function setDirection(newDir) {
  if (newDir.x === -direction.x && newDir.y === -direction.y) return;
  if (!started) startGame();
  nextDirection = newDir;
}

document.addEventListener('keydown', e => {
  const map = {
    ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 }
  };
  const newDir = map[e.key];
  if (!newDir) return;
  e.preventDefault();
  if (!running && started) return;
  setDirection(newDir);
});

dpadButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const dirMap = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };
    if (!running && started) return;
    setDirection(dirMap[btn.dataset.dir]);
  });
});

let touchStartX = 0, touchStartY = 0;
canvas.addEventListener('touchstart', e => {
  const t = e.changedTouches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

canvas.addEventListener('touchend', e => {
  if (!running && started) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
  if (Math.abs(dx) > Math.abs(dy)) {
    setDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
  } else {
    setDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
  }
}, { passive: true });

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freqs, duration = 0.09) {
  try {
    const ctxA = getAudioCtx();
    freqs.forEach((freq, i) => {
      const osc = ctxA.createOscillator();
      const gain = ctxA.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctxA.currentTime + i * duration);
      gain.gain.exponentialRampToValueAtTime(0.001, ctxA.currentTime + (i + 1) * duration);
      osc.connect(gain);
      gain.connect(ctxA.destination);
      osc.start(ctxA.currentTime + i * duration);
      osc.stop(ctxA.currentTime + (i + 1) * duration);
    });
  } catch (e) {}
}

function soundEat() { playTone([660, 880]); }
function soundGameOver() { playTone([392, 311, 261, 196], 0.14); }