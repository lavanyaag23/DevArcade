const STORAGE_KEY = 'chaosButton_v1';

const CHALLENGES = [

  // ── DSA ──
  { cat:'dsa', diff:'easy',   text:'Reverse a string in-place without using built-in reverse methods. No extra array allowed.' },
  { cat:'dsa', diff:'easy',   text:'Check if a string is a palindrome. Handle spaces and punctuation — "A man a plan a canal Panama" should return true.' },
  { cat:'dsa', diff:'easy',   text:'Find the maximum element in an array without using Math.max or sort.' },
  { cat:'dsa', diff:'easy',   text:'Count the number of vowels in a string. Must be case-insensitive.' },
  { cat:'dsa', diff:'medium', text:'Given an array of integers, find two numbers that add up to a target sum. Return their indices. O(n) required.' },
  { cat:'dsa', diff:'medium', text:'Check if two strings are anagrams of each other. No sorting — use a frequency map.' },
  { cat:'dsa', diff:'medium', text:'Flatten a deeply nested array without using Array.prototype.flat().' },
  { cat:'dsa', diff:'medium', text:'Remove duplicates from an array in O(n) time. Return the result in original order.' },
  { cat:'dsa', diff:'medium', text:'Implement a queue using only two stacks. Support enqueue and dequeue operations.' },
  { cat:'dsa', diff:'medium', text:'Given a string, find the length of the longest substring without repeating characters.' },
  { cat:'dsa', diff:'hard',   text:'Implement a binary search tree with insert, search, and in-order traversal methods from scratch.' },
  { cat:'dsa', diff:'hard',   text:'Write a function to detect a cycle in a linked list using Floyd\'s Tortoise and Hare algorithm.' },
  { cat:'dsa', diff:'hard',   text:'Given a matrix, rotate it 90 degrees clockwise in-place without allocating a new matrix.' },
  { cat:'dsa', diff:'hard',   text:'Implement memoized Fibonacci. Then explain why plain recursion is O(2^n) and memoized is O(n).' },
  { cat:'dsa', diff:'hard',   text:'Find the longest common subsequence of two strings. Return the length and the actual subsequence.' },

  // ── FRONTEND ──
  { cat:'frontend', diff:'easy',   text:'Build a countdown timer UI that starts at 60 seconds and goes to 0, then shows "Time\'s up!" — pure vanilla JS.' },
  { cat:'frontend', diff:'easy',   text:'Create a CSS card that flips on hover to reveal its back face. No JavaScript allowed.' },
  { cat:'frontend', diff:'easy',   text:'Build a character counter for a textarea that turns red when the user exceeds 280 characters.' },
  { cat:'frontend', diff:'easy',   text:'Create a responsive navbar that collapses into a hamburger menu on mobile using only CSS (no JS).' },
  { cat:'frontend', diff:'medium', text:'Build an infinite scroll list that fetches and appends items from a mock API as the user scrolls down.' },
  { cat:'frontend', diff:'medium', text:'Implement a custom multi-select dropdown with keyboard navigation (up/down arrows, enter to select, escape to close).' },
  { cat:'frontend', diff:'medium', text:'Build a debounced live-search filter over a list of 200+ items — debounce must be written from scratch.' },
  { cat:'frontend', diff:'medium', text:'Create a drag-and-drop Kanban board with three columns (Todo, In Progress, Done) in vanilla JS.' },
  { cat:'frontend', diff:'medium', text:'Build a reusable React Toast notification system that stacks messages, auto-dismisses after 3s, and supports success/error/info types.' },
  { cat:'frontend', diff:'hard',   text:'Build a fully accessible modal dialog: trap focus inside, close on Escape, restore focus on close, ARIA attributes correct.' },
  { cat:'frontend', diff:'hard',   text:'Create a virtualized list component that only renders visible rows in the viewport (like react-window) — vanilla JS.' },
  { cat:'frontend', diff:'hard',   text:'Build a color picker component from scratch — no libraries, renders a hue-saturation square and lightness slider.' },
  { cat:'frontend', diff:'hard',   text:'Implement undo/redo for a text editor using the Command pattern. Support at least 20 levels of history.' },

  // ── BACKEND ──
  { cat:'backend', diff:'easy',   text:'Write a Node.js Express middleware that rate-limits requests to 100 per IP per minute using in-memory storage.' },
  { cat:'backend', diff:'easy',   text:'Build a REST endpoint that accepts a list of integers and returns their mean, median, and mode.' },
  { cat:'backend', diff:'easy',   text:'Write a function that deep-clones a JavaScript object without using JSON.parse/JSON.stringify or lodash.' },
  { cat:'backend', diff:'medium', text:'Design and implement a simple in-memory caching layer (LRU cache) with a capacity of 100 and TTL expiry per key.' },
  { cat:'backend', diff:'medium', text:'Write a JWT authentication middleware for Express that validates the token, extracts the user, and handles expiry gracefully.' },
  { cat:'backend', diff:'medium', text:'Build a CSV parser from scratch that handles quoted fields, escaped commas, and multi-line values correctly.' },
  { cat:'backend', diff:'medium', text:'Implement an event emitter class (like Node\'s EventEmitter) with on(), off(), emit(), and once() methods.' },
  { cat:'backend', diff:'hard',   text:'Design a real-time notification system using WebSockets. Handle reconnection, missed messages, and user-specific channels.' },
  { cat:'backend', diff:'hard',   text:'Write a connection pool for a PostgreSQL database from scratch — manage idle connections, acquire timeouts, and graceful shutdown.' },
  { cat:'backend', diff:'hard',   text:'Implement a simple task queue with priorities, retries on failure, and a worker pool of N concurrent workers.' },

  // ── DEBUG ──
  { cat:'debug', diff:'easy',   text:'Your API always returns 401 Unauthorized even though the token looks valid. Walk through every step you would take to debug this.' },
  { cat:'debug', diff:'easy',   text:'A webpage looks correct in Chrome but broken in Safari. List 5 specific things you would check first.' },
  { cat:'debug', diff:'medium', text:'A React component re-renders 50+ times per second even when no state changes. How do you find the root cause and fix it?' },
  { cat:'debug', diff:'medium', text:'Your Node.js server memory usage climbs 50MB every hour and never drops. Describe exactly how you would identify the leak.' },
  { cat:'debug', diff:'medium', text:'Users report the app "sometimes doesn\'t save". The save function looks correct. What are five possible race-condition causes?' },
  { cat:'debug', diff:'medium', text:'A SQL query takes 12 seconds on 1M rows. Explain every step of how you\'d diagnose and optimize it.' },
  { cat:'debug', diff:'hard',   text:'A distributed system occasionally drops messages between services with no error logged. Trace every possible failure point.' },
  { cat:'debug', diff:'hard',   text:'Your CI pipeline passes but production breaks on deploy. List 8 concrete causes and how you\'d narrow them down in 15 minutes.' },

  // ── SYSTEM DESIGN ──
  { cat:'system', diff:'medium', text:'Design a URL shortener like bit.ly. Cover data model, hashing strategy, redirect flow, and how you\'d handle 10k requests/sec.' },
  { cat:'system', diff:'medium', text:'Design a notification service that sends emails, SMS, and push notifications. How do you handle failures and retries?' },
  { cat:'system', diff:'medium', text:'Design a rate limiter for an API used by 1 million users. Compare token bucket vs sliding window approaches.' },
  { cat:'system', diff:'hard',   text:'Design Twitter\'s timeline feature. How do you serve the feed for a user with 50M followers in under 100ms?' },
  { cat:'system', diff:'hard',   text:'Design a real-time collaborative code editor (like VS Code Live Share). How do you handle merge conflicts between simultaneous edits?' },
  { cat:'system', diff:'hard',   text:'Design a distributed job scheduler that runs 100k cron jobs across a cluster with no single point of failure.' },
  { cat:'system', diff:'hard',   text:'Design a global CDN for video streaming. Cover content replication, cache invalidation, and adaptive bitrate selection.' },

  // ── GIT / DEVOPS ──
  { cat:'git', diff:'easy',   text:'Explain the difference between git merge and git rebase. When would you use each? What are the risks of rebasing shared branches?' },
  { cat:'git', diff:'easy',   text:'You accidentally committed secrets to a public repo 3 commits ago. Walk through every step to fully remove them from history.' },
  { cat:'git', diff:'medium', text:'A git bisect session finds the commit that introduced a bug, but that commit changes 400 files. What\'s your next move?' },
  { cat:'git', diff:'medium', text:'Write a GitHub Actions workflow that lints, tests, builds, and deploys a Node.js app to a server only on pushes to main.' },
  { cat:'git', diff:'medium', text:'Your team has 20 feature branches all 3 weeks behind main. Design a branching strategy and migration plan to fix this.' },
  { cat:'git', diff:'hard',   text:'Design a CI/CD pipeline for a monorepo with 15 packages. Only rebuild and deploy the packages that were actually changed.' },
  { cat:'git', diff:'hard',   text:'Write a pre-commit git hook that runs ESLint, Prettier, and blocks the commit if any staged file has a TODO comment.' },
];

const DIFF_CONFIG = {
  easy:   { dots: 1, label: 'Easy', cls: 'easy' },
  medium: { dots: 2, label: 'Medium', cls: 'med' },
  hard:   { dots: 3, label: 'Hard', cls: 'hard' }
};

const CAT_LABELS = {
  dsa:'dsa', frontend:'frontend', backend:'backend',
  debug:'debug', system:'system', git:'git'
};

// DOM
const survivedStat = document.getElementById('survivedStat');
const skippedStat  = document.getElementById('skippedStat');
const streakStat   = document.getElementById('streakStat');
const filterBtns   = document.querySelectorAll('.filter-btn');
const challengeCard = document.getElementById('challengeCard');
const catBadge     = document.getElementById('catBadge');
const d1 = document.getElementById('d1');
const d2 = document.getElementById('d2');
const d3 = document.getElementById('d3');
const diffLabel    = document.getElementById('diffLabel');
const challengeText = document.getElementById('challengeText');
const timerDisplay = document.getElementById('timerDisplay');
const timerCount   = document.getElementById('timerCount');
const copyBtn      = document.getElementById('copyBtn');
const timerToggleBtn = document.getElementById('timerToggleBtn');
const idleHint     = document.getElementById('idleHint');
const chaosBtn     = document.getElementById('chaosBtn');
const outcomeRow   = document.getElementById('outcomeRow');
const surviveBtn   = document.getElementById('surviveBtn');
const skipBtn      = document.getElementById('skipBtn');
const historySection = document.getElementById('historySection');
const historyList  = document.getElementById('historyList');

let state = loadState();
let currentFilter = 'all';
let currentChallenge = null;
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let audioCtx = null;

renderStats();

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.cat;
  });
});

chaosBtn.addEventListener('click', launchChaos);
surviveBtn.addEventListener('click', () => recordOutcome('survived'));
skipBtn.addEventListener('click', () => recordOutcome('skipped'));
copyBtn.addEventListener('click', copyChallenge);
timerToggleBtn.addEventListener('click', toggleTimer);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { survived: 0, skipped: 0, streak: 0, bestStreak: 0, history: [] };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function launchChaos() {
  // pick challenge
  const pool = currentFilter === 'all'
    ? CHALLENGES
    : CHALLENGES.filter(c => c.cat === currentFilter);

  if (!pool.length) return;
  const ch = pool[Math.floor(Math.random() * pool.length)];
  currentChallenge = ch;

  // render
  catBadge.textContent = CAT_LABELS[ch.cat];
  catBadge.className = `cat-badge cat-${ch.cat}`;

  const dc = DIFF_CONFIG[ch.diff];
  [d1, d2, d3].forEach((dot, i) => {
    dot.className = `diff-dot${i < dc.dots ? ` lit-${dc.cls}` : ''}`;
  });
  diffLabel.textContent = dc.label;
  diffLabel.className = `diff-label ${dc.cls}`;

  challengeText.textContent = ch.text;

  // stop timer
  clearTimer();
  timerDisplay.classList.add('hidden');
  timerToggleBtn.title = 'Start timer';

  // quake animation
  challengeCard.classList.remove('quake');
  void challengeCard.offsetWidth;
  challengeCard.classList.add('hidden');
  void challengeCard.offsetWidth;
  challengeCard.classList.remove('hidden');
  challengeCard.classList.add('quake');

  idleHint.classList.add('hidden');
  outcomeRow.classList.remove('hidden');
  challengeCard.classList.remove('hidden');

  soundChaos();
}

function recordOutcome(type) {
  clearTimer();
  timerDisplay.classList.add('hidden');

  if (type === 'survived') {
    state.survived++;
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    soundSurvive();
  } else {
    state.skipped++;
    state.streak = 0;
    soundSkip();
  }

  if (currentChallenge) {
    state.history.unshift({
      text: currentChallenge.text,
      cat: currentChallenge.cat,
      diff: currentChallenge.diff,
      outcome: type
    });
    state.history = state.history.slice(0, 5);
  }

  saveState();
  renderStats();
  renderHistory();
  outcomeRow.classList.add('hidden');
}

function renderStats() {
  survivedStat.textContent = state.survived;
  skippedStat.textContent  = state.skipped;
  streakStat.textContent   = state.bestStreak;
}

function renderHistory() {
  if (!state.history.length) return;
  historySection.classList.remove('hidden');
  historyList.innerHTML = '';
  state.history.forEach(item => {
    const el = document.createElement('div');
    el.className = 'history-item';
    el.innerHTML = `
      <span class="history-badge cat-${item.cat}">${item.cat}</span>
      <span class="history-text">${item.text}</span>
      <span class="history-outcome">${item.outcome === 'survived' ? '✅' : '💀'}</span>
    `;
    historyList.appendChild(el);
  });
}

function toggleTimer() {
  if (timerRunning) {
    clearTimer();
    timerDisplay.classList.add('hidden');
    timerToggleBtn.title = 'Start timer';
    return;
  }

  // pick a time based on difficulty
  const timeMap = { easy: 300, medium: 600, hard: 1800 };
  timerSeconds = currentChallenge ? timeMap[currentChallenge.diff] : 300;
  timerRunning = true;
  timerDisplay.classList.remove('hidden');
  timerToggleBtn.title = 'Stop timer';
  renderTimerDisplay();

  timerInterval = setInterval(() => {
    timerSeconds--;
    renderTimerDisplay();
    if (timerSeconds <= 0) {
      clearTimer();
      timerCount.textContent = 'Done!';
      timerDisplay.classList.remove('urgent');
      soundTimeout();
    }
  }, 1000);
}

function clearTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
}

function renderTimerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  timerCount.textContent = m > 0
    ? `${m}:${String(s).padStart(2, '0')}`
    : `${timerSeconds}s`;
  timerDisplay.classList.toggle('urgent', timerSeconds <= 30);
}

function copyChallenge() {
  if (!currentChallenge) return;
  navigator.clipboard.writeText(currentChallenge.text).then(() => showToast('Copied! 📋'));
}

function showToast(msg) {
  let toast = document.querySelector('.copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'copy-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ── Audio ──
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freqs, dur = 0.1, type = 'sine') {
  try {
    const ctx = getAudioCtx();
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = type; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.07, ctx.currentTime + i * dur);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * dur);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * dur);
      osc.stop(ctx.currentTime + (i + 1) * dur);
    });
  } catch {}
}

function soundChaos()   { playTone([110, 220, 440, 880], 0.07, 'sawtooth'); }
function soundSurvive() { playTone([523, 659, 784, 1047], 0.1); }
function soundSkip()    { playTone([300, 220, 160], 0.1); }
function soundTimeout() { playTone([880, 440, 220], 0.12); }

// render existing history on load
renderHistory();