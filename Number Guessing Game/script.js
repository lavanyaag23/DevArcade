/* ================================================================
   GUESS THE NUMBER — script.js
   Features: Difficulty levels · Hot-cold meter · Sound effects
             Score system · Streak tracking · Confetti · Particles
   ================================================================ */

// ── DIFFICULTY CONFIG ──────────────────────────────────────────
const DIFFICULTIES = {
  easy:   { min: 1,   max: 50,  tries: 12, label: 'Easy',   scoreBase: 100 },
  medium: { min: 1,   max: 100, tries: 10, label: 'Medium', scoreBase: 200 },
  hard:   { min: 1,   max: 200, tries: 8,  label: 'Hard',   scoreBase: 400 },
};

// ── DOM REFS ───────────────────────────────────────────────────
const guessInput     = document.getElementById('guess-input');
const guessBtn       = document.getElementById('guess-btn');
const feedbackEl     = document.getElementById('feedback');
const fbIcon         = document.getElementById('fb-icon');
const fbText         = document.getElementById('fb-text');
const historyList    = document.getElementById('history-list');
const historyWrap    = document.getElementById('history-wrap');
const historyCount   = document.getElementById('history-count');
const dotsContainer  = document.getElementById('dots-container');
const attemptsUsed   = document.getElementById('attempts-used');
const attemptsTotal  = document.getElementById('attempts-total');
const gameCard       = document.getElementById('game-card');
const endScreen      = document.getElementById('end-screen');
const endIcon        = document.getElementById('end-icon');
const endTitle       = document.getElementById('end-title');
const endMsg         = document.getElementById('end-msg');
const endStats       = document.getElementById('end-stats');
const restartBtn     = document.getElementById('restart-btn');
const heatThumb      = document.getElementById('heatbar-thumb');
const rangeDisplay   = document.getElementById('range-display');
const scoreVal       = document.getElementById('score-val');
const bestVal        = document.getElementById('best-val');
const streakVal      = document.getElementById('streak-val');
const confettiCanvas = document.getElementById('confetti-canvas');
const particlesCanvas= document.getElementById('particles-canvas');

// ── STATE ─────────────────────────────────────────────────────
let secret, attempts, gameOver, diff;
let rangeLow, rangeHigh;          // shrinks after each guess
let totalScore = 0, bestScore = 0, streak = 0;

// ── AUDIO ─────────────────────────────────────────────────────
const AC = window.AudioContext || window.webkitAudioContext;
let ac = null;

function getAC() {
  if (!ac) ac = new AC();
  return ac;
}

function playTone(freq, type, duration, vol = 0.18, delay = 0) {
  try {
    const ctx = getAC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    g.gain.setValueAtTime(0, ctx.currentTime + delay);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    o.start(ctx.currentTime + delay);
    o.stop(ctx.currentTime + delay + duration + 0.05);
  } catch(e) {}
}

function soundHigh() { playTone(220, 'sawtooth', 0.15, 0.12); }
function soundLow()  { playTone(180, 'sawtooth', 0.15, 0.12); }
function soundWin()  {
  [523, 659, 784, 1047].forEach((f, i) => playTone(f, 'sine', 0.25, 0.15, i * 0.12));
}
function soundLose() {
  [300, 250, 200].forEach((f, i) => playTone(f, 'square', 0.2, 0.1, i * 0.14));
}
function soundTick() { playTone(440, 'sine', 0.06, 0.07); }

// ── PARTICLES ─────────────────────────────────────────────────
(function initParticles() {
  const cvs = particlesCanvas;
  const ctx = cvs.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = cvs.width  = window.innerWidth;
    H = cvs.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 55; i++) {
    pts.push({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,160,${p.alpha})`;
      ctx.fill();
    });

    // connect nearby
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,245,160,${0.06 * (1 - d/110)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── CONFETTI ──────────────────────────────────────────────────
let confettiPieces = [];
let confettiRunning = false;

function launchConfetti() {
  const cvs = confettiCanvas;
  cvs.width  = window.innerWidth;
  cvs.height = window.innerHeight;
  confettiPieces = [];

  const colors = ['#00f5a0','#ffb347','#ff4e50','#4fa3e0','#c77dff','#ffe066'];
  for (let i = 0; i < 130; i++) {
    confettiPieces.push({
      x: Math.random() * cvs.width,
      y: -10 - Math.random() * 80,
      w: 7 + Math.random() * 7,
      h: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: 3 + Math.random() * 4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.18,
      alpha: 1,
    });
  }

  if (!confettiRunning) {
    confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  const cvs = confettiCanvas;
  const ctx = cvs.getContext('2d');
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  confettiPieces = confettiPieces.filter(p => p.alpha > 0.02);

  confettiPieces.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    if (p.y > cvs.height * 0.7) p.alpha -= 0.02;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
  });

  if (confettiPieces.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
  }
}

// ── DIFFICULTY ────────────────────────────────────────────────
let currentDiff = 'medium';

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentDiff = btn.dataset.diff;
    initGame();
  });
});

// ── INIT ──────────────────────────────────────────────────────
function initGame() {
  diff      = DIFFICULTIES[currentDiff];
  secret    = Math.floor(Math.random() * (diff.max - diff.min + 1)) + diff.min;
  attempts  = 0;
  gameOver  = false;
  rangeLow  = diff.min;
  rangeHigh = diff.max;

  guessInput.value    = '';
  guessInput.disabled = false;
  guessBtn.disabled   = false;
  guessInput.min      = diff.min;
  guessInput.max      = diff.max;

  historyList.innerHTML = '';
  historyWrap.style.display = 'none';

  attemptsUsed.textContent  = 0;
  attemptsTotal.textContent = diff.tries;

  setFeedback('', '💡', `Pick a number between ${diff.min} and ${diff.max}.`);
  updateRange();
  updateHeat(0.5);            // start thumb in middle
  buildDots();

  gameCard.className = 'card';
  gameCard.style.display = '';
  endScreen.classList.add('hidden');

  guessInput.focus();
}

function buildDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < diff.tries; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    d.id = `dot-${i}`;
    dotsContainer.appendChild(d);
  }
}

// ── HEAT METER ────────────────────────────────────────────────
function updateHeat(pct) {
  // pct 0 = ice cold, 1 = burning hot
  const clamped = Math.max(0, Math.min(1, pct));
  heatThumb.style.left = `${clamped * 100}%`;

  // colour thumb
  if (clamped > 0.75)      heatThumb.style.background = '#ff4e50';
  else if (clamped > 0.5)  heatThumb.style.background = '#fc913a';
  else if (clamped > 0.25) heatThumb.style.background = '#7eb8f7';
  else                     heatThumb.style.background = '#4fa3e0';
}

function calcHeatPct(guess) {
  // distance as % of full range
  const range = diff.max - diff.min;
  const dist  = Math.abs(guess - secret);
  const pct   = 1 - (dist / range);   // closer = hotter
  return Math.max(0, Math.min(1, pct));
}

// ── RANGE ─────────────────────────────────────────────────────
function updateRange() {
  rangeDisplay.textContent = `${rangeLow} – ${rangeHigh}`;
  // bounce animation
  rangeDisplay.style.animation = 'none';
  rangeDisplay.offsetHeight;
  rangeDisplay.style.animation = 'bounceNum 0.3s ease';
}

// ── SCORE ─────────────────────────────────────────────────────
function calcScore(triesLeft) {
  const base    = diff.scoreBase;
  const bonus   = triesLeft * 15;
  const streakB = streak * 25;
  return base + bonus + streakB;
}

function popScore(el) {
  el.classList.remove('pop');
  el.offsetHeight;
  el.classList.add('pop');
  el.addEventListener('animationend', () => el.classList.remove('pop'), { once: true });
}

// ── MAIN GUESS ────────────────────────────────────────────────
function handleGuess() {
  if (gameOver) return;
  soundTick();

  const raw = guessInput.value.trim();
  const val = parseInt(raw, 10);

  if (!raw || isNaN(val) || val < diff.min || val > diff.max) {
    guessInput.classList.add('shake');
    guessInput.addEventListener('animationend', () => guessInput.classList.remove('shake'), { once: true });
    setFeedback('', '⚠️', `Please enter a number between ${diff.min} and ${diff.max}.`);
    return;
  }

  attempts++;
  attemptsUsed.textContent = attempts;
  const remaining = diff.tries - attempts;
  const heat = calcHeatPct(val);
  updateHeat(heat);

  const dot = document.getElementById(`dot-${attempts - 1}`);

  if (val === secret) {
    dot.className = 'dot d-win';
    addHistory(val, 'hi-win', '🎯 Correct!', 1);
    setFeedback('fb-win', '🎯', `Correct! The number was ${secret}.`);
    gameCard.className = 'card state-win';
    endGameWin();

  } else if (val > secret) {
    dot.className = 'dot d-high';
    rangeLow  = rangeLow;    // low bound unchanged
    rangeHigh = Math.min(rangeHigh, val - 1);
    updateRange();

    const hot = heat > 0.7 ? '🔥 Very close!' : heat > 0.45 ? '📍 Getting warmer.' : '❄️ Way too high.';
    const left = remaining > 0 ? ` ${remaining} left.` : '';
    addHistory(val, 'hi-high', '↓ Too high', heat);
    setFeedback('fb-high', '🔻', `Too high! ${hot}${left}`);
    gameCard.className = 'card state-high';
    soundHigh();

  } else {
    dot.className = 'dot d-low';
    rangeLow  = Math.max(rangeLow, val + 1);
    updateRange();

    const hot = heat > 0.7 ? '🔥 Very close!' : heat > 0.45 ? '📍 Getting warmer.' : '❄️ Way too low.';
    const left = remaining > 0 ? ` ${remaining} left.` : '';
    addHistory(val, 'hi-low', '↑ Too low', heat);
    setFeedback('fb-low', '🔺', `Too low! ${hot}${left}`);
    gameCard.className = 'card state-low';
    soundLow();
  }

  guessInput.value = '';
  guessInput.focus();

  if (attempts >= diff.tries && val !== secret) {
    endGameLose();
  }
}

// ── END WIN ───────────────────────────────────────────────────
function endGameWin() {
  gameOver = true;
  guessInput.disabled = true;
  guessBtn.disabled   = true;

  const triesLeft = diff.tries - attempts;
  const earned    = calcScore(triesLeft);
  totalScore     += earned;
  streak         += 1;
  if (totalScore > bestScore) bestScore = totalScore;

  scoreVal.textContent  = totalScore;
  bestVal.textContent   = bestScore;
  streakVal.textContent = streak + '🔥';
  popScore(scoreVal);
  popScore(streakVal);

  soundWin();
  launchConfetti();

  setTimeout(() => {
    gameCard.style.display = 'none';
    endScreen.classList.remove('hidden');
    endScreen.style.borderColor = 'var(--neon)';
    endIcon.textContent = attempts === 1 ? '🧠' : attempts <= 3 ? '🏆' : '🎉';
    endTitle.textContent = attempts === 1 ? 'Mind Reader!' : attempts <= 3 ? 'Brilliant!' : 'You got it!';
    endTitle.className = 'end-title win-t';

    const comment = attempts === 1 ? 'First try. Absolutely unreal.'
      : attempts <= 3 ? 'Solved it fast — top notch!'
      : attempts <= 6 ? 'Solid performance!'
      : 'Close call, but you made it!';

    endMsg.innerHTML = `The number was <strong>${secret}</strong>. ${comment}`;

    endStats.innerHTML = `
      <div class="stat-chip">
        <span class="sc-label">Guesses</span>
        <span class="sc-val">${attempts} / ${diff.tries}</span>
      </div>
      <div class="stat-chip">
        <span class="sc-label">Points</span>
        <span class="sc-val">+${earned}</span>
      </div>
      <div class="stat-chip">
        <span class="sc-label">Streak</span>
        <span class="sc-val">${streak}🔥</span>
      </div>
      <div class="stat-chip">
        <span class="sc-label">Difficulty</span>
        <span class="sc-val">${diff.label}</span>
      </div>`;
  }, 700);
}

// ── END LOSE ──────────────────────────────────────────────────
function endGameLose() {
  gameOver = true;
  guessInput.disabled = true;
  guessBtn.disabled   = true;
  streak = 0;
  streakVal.textContent = '0🔥';

  soundLose();

  setTimeout(() => {
    gameCard.style.display = 'none';
    endScreen.classList.remove('hidden');
    endScreen.style.borderColor = 'var(--lose)';
    endIcon.textContent  = '💀';
    endTitle.textContent = 'Out of Guesses';
    endTitle.className   = 'end-title lose-t';
    endMsg.innerHTML     = `The number was <strong>${secret}</strong>. Better luck next round!`;
    endStats.innerHTML   = `
      <div class="stat-chip">
        <span class="sc-label">The Answer</span>
        <span class="sc-val">${secret}</span>
      </div>
      <div class="stat-chip">
        <span class="sc-label">Difficulty</span>
        <span class="sc-val">${diff.label}</span>
      </div>
      <div class="stat-chip">
        <span class="sc-label">Streak</span>
        <span class="sc-val">💔 Reset</span>
      </div>`;
  }, 600);
}

// ── HISTORY ───────────────────────────────────────────────────
function addHistory(num, type, hint, heatPct) {
  historyWrap.style.display = '';
  const li = document.createElement('li');
  li.className = `history-item ${type}`;
  const barW = Math.round(heatPct * 100);
  li.innerHTML = `
    <span class="h-num">${num}</span>
    <div class="h-bar"><div class="h-bar-fill" style="width:${barW}%"></div></div>
    <span class="h-hint">${hint}</span>`;
  historyList.prepend(li);
  historyCount.textContent = `${attempts} guess${attempts !== 1 ? 'es' : ''}`;
}

// ── FEEDBACK ─────────────────────────────────────────────────
function setFeedback(cls, icon, text) {
  feedbackEl.className = `feedback ${cls}`;
  fbIcon.textContent   = icon;
  fbText.textContent   = text;
}

// ── EVENTS ────────────────────────────────────────────────────
guessBtn.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleGuess(); });
restartBtn.addEventListener('click', initGame);

// ── KICK OFF ─────────────────────────────────────────────────
initGame();