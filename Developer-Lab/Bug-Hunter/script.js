const STORAGE_KEY = 'bugHunterBest_v1';
const MAX_MISSED = 5;
const BUG_SIZE = 48;
const BASE_SHOW_TIME = 1400;
const MIN_SHOW_TIME = 550;
const BASE_SPAWN_GAP = 450;
const MIN_SPAWN_GAP = 200;

const arena = document.getElementById('arena');
const arenaHint = document.getElementById('arenaHint');
const scoreEl = document.getElementById('score');
const missedEl = document.getElementById('missed');
const bestStatEl = document.getElementById('bestStat');
const startBtn = document.getElementById('startBtn');
const endOverlay = document.getElementById('endOverlay');
const finalScoreEl = document.getElementById('finalScore');
const newBestTag = document.getElementById('newBestTag');
const playAgainBtn = document.getElementById('playAgainBtn');

let best = Number(localStorage.getItem(STORAGE_KEY)) || 0;
let score = 0;
let missed = 0;
let running = false;
let spawnTimer = null;
let audioCtx = null;

bestStatEl.textContent = best || '--';

startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', () => {
  hideOverlay(endOverlay);
  startGame();
});

function startGame() {
  running = true;
  score = 0;
  missed = 0;
  updateScore();
  updateMissed();
  startBtn.disabled = true;
  arenaHint.classList.add('hidden');
  hideOverlay(endOverlay);
  clearArena();
  scheduleSpawn(300);
}

function scheduleSpawn(delay) {
  if (!running) return;
  clearTimeout(spawnTimer);
  spawnTimer = setTimeout(spawnBug, delay);
}

function spawnBug() {
  if (!running) return;

  const rect = arena.getBoundingClientRect();
  const maxX = Math.max(0, rect.width - BUG_SIZE);
  const maxY = Math.max(0, rect.height - BUG_SIZE);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  const bug = document.createElement('div');
  bug.className = 'bug';
  bug.textContent = '🐞';
  bug.style.left = x + 'px';
  bug.style.top = y + 'px';
  arena.appendChild(bug);

  const showTime = Math.max(MIN_SHOW_TIME, BASE_SHOW_TIME - score * 25);
  const escapeTimer = setTimeout(() => onEscape(bug), showTime);

  bug.addEventListener('click', () => onCatch(bug, escapeTimer), { once: true });
}

function onCatch(bug, escapeTimer) {
  if (!running) return;
  clearTimeout(escapeTimer);
  bug.classList.add('caught');
  soundCatch();
  burstParticles(bug, ['#22d3ee', '#a855f7']);
  score++;
  updateScore();
  setTimeout(() => bug.remove(), 260);

  const gap = Math.max(MIN_SPAWN_GAP, BASE_SPAWN_GAP - score * 6);
  scheduleSpawn(gap);
}

function onEscape(bug) {
  if (!running) return;
  bug.classList.add('escaped');
  soundMiss();
  setTimeout(() => bug.remove(), 320);

  missed++;
  updateMissed();

  if (missed >= MAX_MISSED) {
    endGame();
    return;
  }

  const gap = Math.max(MIN_SPAWN_GAP, BASE_SPAWN_GAP - score * 6);
  scheduleSpawn(gap);
}

function endGame() {
  running = false;
  clearTimeout(spawnTimer);
  clearArena();
  arenaHint.classList.remove('hidden');
  arenaHint.textContent = 'Press Start to release the bugs';
  startBtn.disabled = false;
  soundGameOver();

  const isNewBest = score > best;
  if (isNewBest) {
    best = score;
    localStorage.setItem(STORAGE_KEY, String(best));
  }

  finalScoreEl.textContent = score;
  newBestTag.classList.toggle('hidden', !isNewBest);
  bestStatEl.textContent = best || '--';

  setTimeout(() => showOverlay(endOverlay), 350);
}

function clearArena() {
  [...arena.querySelectorAll('.bug')].forEach(b => b.remove());
}

function updateScore() {
  scoreEl.textContent = score;
  bumpUpdate(scoreEl);
}

function updateMissed() {
  missedEl.textContent = `${missed}/${MAX_MISSED}`;
  bumpUpdate(missedEl);
  missedEl.classList.toggle('danger', missed >= MAX_MISSED - 1);
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

function playTone(freqs, duration = 0.09) {
  try {
    const ctx = getAudioCtx();
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * duration);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * duration);
      osc.stop(ctx.currentTime + (i + 1) * duration);
    });
  } catch (e) {}
}

function soundCatch() { playTone([700, 950], 0.05); }
function soundMiss() { playTone([260, 200], 0.07); }
function soundGameOver() { playTone([392, 330, 261, 196], 0.13); }

function burstParticles(el, colors) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.background = colors[i % colors.length];
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    document.body.appendChild(p);

    const angle = (Math.PI * 2 * i) / 10;
    const dist = 35 + Math.random() * 30;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], { duration: 420, easing: 'cubic-bezier(.2,.8,.3,1)' });

    setTimeout(() => p.remove(), 440);
  }
}