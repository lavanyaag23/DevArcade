const ICONS = { rock: '🪨', paper: '📄', scissors: '✂️' };
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
const STORAGE_KEY = 'rpsStats_v1';

const playerDisplay = document.getElementById('playerDisplay');
const computerDisplay = document.getElementById('computerDisplay');
const resultBanner = document.getElementById('resultBanner');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const tieScoreEl = document.getElementById('tieScore');
const streakDisplay = document.getElementById('streakDisplay');
const buttons = document.querySelectorAll('.choice-btn');
const resetBtn = document.getElementById('resetBtn');

let state = loadState();
let busy = false;
let audioCtx = null;

renderScores();
renderStreak();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { player: 0, computer: 0, ties: 0, streak: 0, bestStreak: 0 };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freqs, duration = 0.12) {
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

function soundWin() { playTone([523, 659, 784]); }
function soundLose() { playTone([392, 311, 261]); }
function soundTie() { playTone([440, 440]); }

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (busy) return;
    playRound(btn.dataset.choice);
  });
});

resetBtn.addEventListener('click', () => {
  state = { player: 0, computer: 0, ties: 0, streak: 0, bestStreak: state.bestStreak };
  saveState();
  renderScores();
  renderStreak();
  playerDisplay.textContent = '❔';
  computerDisplay.textContent = '❔';
  playerDisplay.className = 'choice-display';
  computerDisplay.className = 'choice-display';
  resultBanner.textContent = 'Make your move';
  resultBanner.className = 'result-banner';
});

function playRound(playerChoice) {
  busy = true;
  buttons.forEach(b => b.disabled = true);

  playerDisplay.className = 'choice-display shake';
  computerDisplay.className = 'choice-display shake';
  playerDisplay.textContent = ICONS[playerChoice];
  computerDisplay.textContent = '❓';
  resultBanner.textContent = 'Rock... Paper... Scissors...';
  resultBanner.className = 'result-banner';

  setTimeout(() => {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    playerDisplay.className = 'choice-display reveal';
    computerDisplay.className = 'choice-display reveal';
    computerDisplay.textContent = ICONS[computerChoice];

    let outcome;
    if (playerChoice === computerChoice) {
      outcome = 'tie';
    } else if (BEATS[playerChoice] === computerChoice) {
      outcome = 'win';
    } else {
      outcome = 'lose';
    }

    applyOutcome(outcome, playerChoice, computerChoice);

    setTimeout(() => {
      busy = false;
      buttons.forEach(b => b.disabled = false);
    }, 250);
  }, 650);
}

function applyOutcome(outcome, playerChoice, computerChoice) {
  if (outcome === 'win') {
    state.player++;
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    resultBanner.textContent = 'You Win!';
    resultBanner.className = 'result-banner win';
    playerDisplay.classList.add('win-glow');
    computerDisplay.classList.add('lose-glow');
    soundWin();
    burstParticles();
  } else if (outcome === 'lose') {
    state.computer++;
    state.streak = 0;
    resultBanner.textContent = 'Computer Wins';
    resultBanner.className = 'result-banner lose';
    computerDisplay.classList.add('win-glow');
    playerDisplay.classList.add('lose-glow');
    soundLose();
  } else {
    state.ties++;
    resultBanner.textContent = "It's a Tie!";
    resultBanner.className = 'result-banner tie';
    playerDisplay.classList.add('tie-glow');
    computerDisplay.classList.add('tie-glow');
    soundTie();
  }

  saveState();
  renderScores();
  renderStreak();
}

function renderScores() {
  bumpUpdate(playerScoreEl, state.player);
  bumpUpdate(computerScoreEl, state.computer);
  bumpUpdate(tieScoreEl, state.ties);
}

function bumpUpdate(el, value) {
  if (el.textContent !== String(value)) {
    el.textContent = value;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }
}

function renderStreak() {
  if (state.streak >= 2) {
    streakDisplay.innerHTML = `<span class="flame">🔥</span> ${state.streak} win streak`;
  } else if (state.bestStreak >= 2) {
    streakDisplay.textContent = `Best streak: ${state.bestStreak}`;
  } else {
    streakDisplay.textContent = '';
  }
}

function burstParticles() {
  const rect = playerDisplay.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (Math.PI * 2 * i) / 14;
    const dist = 60 + Math.random() * 40;
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.background = i % 2 === 0 ? '#c084fc' : '#34d399';
    document.body.appendChild(p);
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
    ], { duration: 600, easing: 'cubic-bezier(.2,.8,.3,1)' });
    setTimeout(() => p.remove(), 620);
  }
}