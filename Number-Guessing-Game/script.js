/* ================================================================
   NUMGAME — script.js  (fully synced with index.html)
   ✅ 4-screen flow: Start → Game → Pause → End
   ✅ Difficulty levels (Easy / Medium / Hard)
   ✅ Hot-cold meter + narrowing range
   ✅ Sound effects (Web Audio API — no files)
   ✅ Confetti on win
   ✅ Ambient particle background
   ✅ Score + streak system
   ✅ localStorage leaderboard (top 10, persisted)
   ✅ Shake on bad input
   ✅ Pause / resume / quit to menu
   ================================================================ */

'use strict';

// ── DIFFICULTY CONFIG ─────────────────────────────────────────
const DIFF = {
  easy:   { min: 1,   max: 50,  tries: 12, label: 'Easy',   scoreBase: 100 },
  medium: { min: 1,   max: 100, tries: 10, label: 'Medium', scoreBase: 200 },
  hard:   { min: 1,   max: 200, tries: 8,  label: 'Hard',   scoreBase: 400 },
};
const LB_KEY    = 'numgame_leaderboard';
const LB_MAX    = 10;

// ── DOM ───────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// screens
const screenStart = $('screen-start');
const screenGame  = $('screen-game');
const screenPause = $('screen-pause');
const screenEnd   = $('screen-end');

// start screen
const btnStart    = $('btn-start');
const lbList      = $('lb-list');
const lbEmpty     = $('lb-empty');
const lbClear     = $('lb-clear');

// game screen
const btnPause    = $('btn-pause');
const curScore    = $('cur-score');
const curBest     = $('cur-best');
const curStreak   = $('cur-streak');
const diffBadge   = $('diff-badge');
const dotsRow     = $('dots-row');
const triesUsed   = $('tries-used');
const triesTotal  = $('tries-total');
const heatThumb   = $('heat-thumb');
const heatWord    = $('heat-word');
const rangeLowEl  = $('range-low');
const rangeHighEl = $('range-high');
const guessInput  = $('guess-input');
const btnGuess    = $('btn-guess');
const feedbackBox = $('feedback-box');
const fbIcon      = $('fb-icon');
const fbText      = $('fb-text');
const historyPanel= $('history-panel');
const histCount   = $('hist-count');
const histList    = $('history-list');

// pause screen
const btnResume   = $('btn-resume');
const btnQuit     = $('btn-quit');

// end screen
const endIcon     = $('end-icon');
const endTitle    = $('end-title');
const endMsg      = $('end-msg');
const endStats    = $('end-stats');
const btnPlayAgain= $('btn-play-again');
const btnMenu     = $('btn-menu');

// canvases
const bgCanvas      = $('bg-canvas');
const confettiCanvas= $('confetti-canvas');

// ── SESSION STATE ─────────────────────────────────────────────
let secret, attempts, gameOver, paused;
let cfg;                       // current difficulty config
let rLow, rHigh;               // narrowing range
let sessionScore = 0;
let sessionBest  = 0;
let streak       = 0;
let currentDiff  = 'medium';

// ── SCREEN ROUTER ─────────────────────────────────────────────
function showScreen(screen) {
  [screenStart, screenGame, screenPause, screenEnd].forEach(s => {
    s.classList.toggle('hidden', s !== screen);
  });
}

// ── LEADERBOARD (localStorage) ────────────────────────────────
function loadLB() {
  try { return JSON.parse(localStorage.getItem(LB_KEY)) || []; }
  catch { return []; }
}

function saveLB(entries) {
  try { localStorage.setItem(LB_KEY, JSON.stringify(entries)); }
  catch {}
}

function addToLB(score, diff) {
  const entries = loadLB();
  entries.push({ score, diff, date: new Date().toLocaleDateString() });
  entries.sort((a, b) => b.score - a.score);
  const trimmed = entries.slice(0, LB_MAX);
  saveLB(trimmed);
  return trimmed;
}

function renderLB() {
  const entries = loadLB();
  lbList.innerHTML = '';
  if (entries.length === 0) {
    lbEmpty.classList.remove('hidden');
    return;
  }
  lbEmpty.classList.add('hidden');
  const medals = ['gold', 'silver', 'bronze'];
  entries.forEach((e, i) => {
    const li = document.createElement('li');
    li.className = 'lb-entry';
    const rankClass = medals[i] || '';
    li.innerHTML = `
      <span class="lb-rank ${rankClass}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</span>
      <span class="lb-name">${e.date}</span>
      <span class="lb-diff">${e.diff}</span>
      <span class="lb-score">${e.score}</span>`;
    lbList.appendChild(li);
  });
}

lbClear.addEventListener('click', () => {
  saveLB([]);
  renderLB();
  soundTick();
});

// ── AUDIO (Web Audio API) ─────────────────────────────────────
let audioCtx = null;
function getAC() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function tone(freq, type, dur, vol = 0.15, delay = 0) {
  try {
    const ac = getAC();
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, ac.currentTime + delay);
    g.gain.setValueAtTime(0, ac.currentTime + delay);
    g.gain.linearRampToValueAtTime(vol, ac.currentTime + delay + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + dur);
    o.start(ac.currentTime + delay);
    o.stop(ac.currentTime + delay + dur + 0.05);
  } catch {}
}
function soundTick()  { tone(440,  'sine',     0.06, 0.07); }
function soundHigh()  { tone(220,  'sawtooth', 0.15, 0.12); }
function soundLow()   { tone(160,  'sawtooth', 0.15, 0.12); }
function soundError() { tone(180,  'square',   0.1,  0.08); }
function soundWin()   { [523,659,784,1047].forEach((f,i) => tone(f,'sine',0.25,0.15,i*0.12)); }
function soundLose()  { [300,240,180].forEach((f,i)       => tone(f,'square',0.2,0.1,i*0.14)); }

// ── AMBIENT PARTICLES ─────────────────────────────────────────
(function particles() {
  const ctx = bgCanvas.getContext('2d');
  let W, H, pts = [];
  const resize = () => { W = bgCanvas.width = innerWidth; H = bgCanvas.height = innerHeight; };
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 50; i++) pts.push({
    x: Math.random()*2000, y: Math.random()*2000,
    vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
    r: Math.random()*1.4+.4, a: Math.random()*.35+.08,
  });
  (function draw() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x%W,p.y%H,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,245,160,${p.a})`;
      ctx.fill();
    });
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
      const d=Math.hypot(dx,dy);
      if(d<120){
        ctx.beginPath();
        ctx.strokeStyle=`rgba(0,245,160,${.055*(1-d/120)})`;
        ctx.lineWidth=.5;
        ctx.moveTo(pts[i].x,pts[i].y);
        ctx.lineTo(pts[j].x,pts[j].y);
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();
})();

// ── CONFETTI ──────────────────────────────────────────────────
let cPieces=[], cRunning=false;
function launchConfetti() {
  confettiCanvas.width=innerWidth; confettiCanvas.height=innerHeight;
  const cols=['#00f5a0','#ffb347','#ff4e50','#4fa3e0','#c77dff','#ffe066'];
  cPieces=[];
  for(let i=0;i<150;i++) cPieces.push({
    x:Math.random()*confettiCanvas.width, y:-10-Math.random()*80,
    w:6+Math.random()*8, h:3+Math.random()*4,
    color:cols[Math.floor(Math.random()*cols.length)],
    vx:(Math.random()-.5)*4.5, vy:3+Math.random()*4.5,
    rot:Math.random()*Math.PI*2, vr:(Math.random()-.5)*.18, a:1,
  });
  if(!cRunning){ cRunning=true; animateConfetti(); }
}
function animateConfetti() {
  const ctx=confettiCanvas.getContext('2d');
  ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  cPieces=cPieces.filter(p=>p.a>.02);
  cPieces.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
    if(p.y>confettiCanvas.height*.72) p.a-=.022;
    ctx.save(); ctx.globalAlpha=p.a;
    ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    ctx.fillStyle=p.color;
    ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
    ctx.restore();
  });
  if(cPieces.length) requestAnimationFrame(animateConfetti);
  else { cRunning=false; ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); }
}

// ── DIFFICULTY BUTTONS (start screen) ────────────────────────
document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    currentDiff = btn.dataset.diff;
    soundTick();
  });
});

// ── START GAME ────────────────────────────────────────────────
btnStart.addEventListener('click', () => { soundTick(); startGame(); });

function startGame() {
  cfg       = DIFF[currentDiff];
  secret    = Math.floor(Math.random()*(cfg.max-cfg.min+1))+cfg.min;
  attempts  = 0;
  gameOver  = false;
  paused    = false;
  rLow      = cfg.min;
  rHigh     = cfg.max;

  // topbar
  curScore.textContent  = sessionScore;
  curBest.textContent   = sessionBest;
  curStreak.textContent = streak+'🔥';
  diffBadge.textContent = cfg.label;
  diffBadge.className   = `diff-badge ${currentDiff}`;

  // tries
  triesUsed.textContent  = 0;
  triesTotal.textContent = cfg.tries;

  // input
  guessInput.value    = '';
  guessInput.disabled = false;
  guessInput.min      = cfg.min;
  guessInput.max      = cfg.max;
  btnGuess.disabled   = false;

  // heat
  setHeat(0.5);

  // range
  setRange(cfg.min, cfg.max);

  // feedback
  setFeedback('', '💡', `Pick a number between ${cfg.min} and ${cfg.max}.`);

  // dots
  buildDots();

  // history
  histList.innerHTML='';
  historyPanel.style.display='none';

  showScreen(screenGame);
  setTimeout(()=>guessInput.focus(), 80);
}

function buildDots() {
  dotsRow.innerHTML='';
  for(let i=0;i<cfg.tries;i++){
    const d=document.createElement('div');
    d.className='dot'; d.id=`dot-${i}`;
    dotsRow.appendChild(d);
  }
}

// ── HEAT METER ────────────────────────────────────────────────
function calcHeat(guess) {
  const dist = Math.abs(guess-secret);
  return Math.max(0, Math.min(1, 1-(dist/(cfg.max-cfg.min))));
}
function setHeat(pct) {
  heatThumb.style.left = `${pct*100}%`;
  if     (pct>.80){ heatThumb.style.background='#ff4e50'; heatWord.style.color='#ff4e50'; heatWord.textContent='Burning 🔥'; }
  else if(pct>.60){ heatThumb.style.background='#fc913a'; heatWord.style.color='#fc913a'; heatWord.textContent='Warm'; }
  else if(pct>.40){ heatThumb.style.background='#9b79e0'; heatWord.style.color='#9b79e0'; heatWord.textContent='Lukewarm'; }
  else if(pct>.20){ heatThumb.style.background='#74b9ff'; heatWord.style.color='#74b9ff'; heatWord.textContent='Cold'; }
  else            { heatThumb.style.background='#4fa3e0'; heatWord.style.color='#4fa3e0'; heatWord.textContent='Freezing ❄️'; }
}

// ── RANGE ─────────────────────────────────────────────────────
function setRange(lo, hi) {
  rangeLowEl.textContent  = lo;
  rangeHighEl.textContent = hi;
  [rangeLowEl, rangeHighEl].forEach(el => {
    el.style.animation='none'; el.offsetHeight;
    el.style.animation='rangeFlash .3s ease';
  });
}

// ── FEEDBACK ──────────────────────────────────────────────────
function setFeedback(cls, icon, text) {
  feedbackBox.className = `feedback-box ${cls}`;
  fbIcon.textContent    = icon;
  fbText.textContent    = text;
}

// ── HISTORY ───────────────────────────────────────────────────
function addHistory(num, cls, hint, heat) {
  historyPanel.style.display='';
  const li=document.createElement('li');
  li.className=`hi ${cls}`;
  li.innerHTML=`
    <span class="hi-num">${num}</span>
    <div class="hi-bar"><div class="hi-fill" style="width:${Math.round(heat*100)}%"></div></div>
    <span class="hi-hint">${hint}</span>`;
  histList.prepend(li);
  histCount.textContent=`${attempts} guess${attempts!==1?'es':''}`;
}

// ── SCORE POP ─────────────────────────────────────────────────
function popEl(el) {
  el.classList.remove('pop'); el.offsetHeight; el.classList.add('pop');
  el.addEventListener('animationend',()=>el.classList.remove('pop'),{once:true});
}

// ── MAIN GUESS HANDLER ────────────────────────────────────────
function handleGuess() {
  if(gameOver||paused) return;
  const raw=guessInput.value.trim();
  const val=parseInt(raw,10);

  // validation
  if(!raw||isNaN(val)||val<cfg.min||val>cfg.max){
    soundError();
    guessInput.classList.add('shake');
    guessInput.addEventListener('animationend',()=>guessInput.classList.remove('shake'),{once:true});
    setFeedback('','⚠️',`Enter a number between ${cfg.min} and ${cfg.max}.`);
    return;
  }

  soundTick();
  attempts++;
  triesUsed.textContent=attempts;
  const left=cfg.tries-attempts;
  const heat=calcHeat(val);
  setHeat(heat);
  const dot=$(`dot-${attempts-1}`);

  if(val===secret){
    // ── WIN
    dot.className='dot d-win';
    addHistory(val,'hi-win','🎯 Correct!',1);
    setFeedback('fb-win','🎯',`Correct! The number was ${secret}.`);
    endWin();

  } else if(val>secret){
    // ── TOO HIGH
    dot.className='dot d-high';
    rHigh=Math.min(rHigh,val-1);
    setRange(rLow,rHigh);
    const hot=heat>.78?'🔥 So close!':heat>.5?'📍 Getting warmer.':'❄️ Way too high.';
    addHistory(val,'hi-high','↓ Too high',heat);
    setFeedback('fb-high','🔻',`Too high! ${hot}${left>0?` ${left} left.`:''}`);
    soundHigh();

  } else {
    // ── TOO LOW
    dot.className='dot d-low';
    rLow=Math.max(rLow,val+1);
    setRange(rLow,rHigh);
    const hot=heat>.78?'🔥 So close!':heat>.5?'📍 Getting warmer.':'❄️ Way too low.';
    addHistory(val,'hi-low','↑ Too low',heat);
    setFeedback('fb-low','🔺',`Too low! ${hot}${left>0?` ${left} left.`:''}`);
    soundLow();
  }

  guessInput.value='';
  guessInput.focus();
  if(attempts>=cfg.tries&&val!==secret) endLose();
}

// ── WIN ───────────────────────────────────────────────────────
function endWin() {
  gameOver=true;
  guessInput.disabled=true; btnGuess.disabled=true;
  soundWin(); launchConfetti();

  const trLeft   = cfg.tries-attempts;
  const earned   = cfg.scoreBase + trLeft*15 + streak*25;
  sessionScore  += earned;
  streak        += 1;
  if(sessionScore>sessionBest) sessionBest=sessionScore;

  curScore.textContent  = sessionScore;
  curBest.textContent   = sessionBest;
  curStreak.textContent = streak+'🔥';
  popEl(curScore); popEl(curStreak);

  // save to leaderboard
  addToLB(sessionScore, cfg.label);

  const comment = attempts===1?'First try — unreal!':attempts<=3?'Cracked it fast!':attempts<=6?'Solid work!':'Squeaked it out!';
  const icon    = attempts===1?'🧠':attempts<=3?'🏆':'🎉';

  setTimeout(()=>{
    endIcon.textContent  = icon;
    endTitle.textContent = attempts===1?'Mind Reader!':attempts<=3?'Brilliant!':'You got it!';
    endTitle.className   = 'end-title win-t';
    endMsg.innerHTML     = `The number was <strong>${secret}</strong>. ${comment}`;
    endStats.innerHTML   = statChip('Guesses',`${attempts}/${cfg.tries}`)
                         + statChip('Points', `+${earned}`)
                         + statChip('Streak',  `${streak}🔥`)
                         + statChip('Level',   cfg.label);
    showScreen(screenEnd);
  }, 750);
}

// ── LOSE ──────────────────────────────────────────────────────
function endLose() {
  gameOver=true;
  guessInput.disabled=true; btnGuess.disabled=true;
  streak=0; curStreak.textContent='0🔥';
  soundLose();

  setTimeout(()=>{
    endIcon.textContent  = '💀';
    endTitle.textContent = 'Out of Guesses';
    endTitle.className   = 'end-title lose-t';
    endMsg.innerHTML     = `The number was <strong>${secret}</strong>. Better luck next round!`;
    endStats.innerHTML   = statChip('Answer',  secret)
                         + statChip('Level',   cfg.label)
                         + statChip('Streak',  '💔 Reset');
    showScreen(screenEnd);
  }, 650);
}

function statChip(label,val){
  return `<div class="stat-chip"><span class="sc-label">${label}</span><span class="sc-val">${val}</span></div>`;
}

// ── PAUSE ─────────────────────────────────────────────────────
btnPause.addEventListener('click', ()=>{ if(!gameOver){ paused=true; soundTick(); showScreen(screenPause); }});
btnResume.addEventListener('click', ()=>{ paused=false; soundTick(); showScreen(screenGame); guessInput.focus(); });
btnQuit.addEventListener('click', ()=>{
  paused=false; gameOver=true; soundTick();
  renderLB();
  showScreen(screenStart);
});

// ── END SCREEN BUTTONS ────────────────────────────────────────
btnPlayAgain.addEventListener('click', ()=>{ soundTick(); startGame(); });
btnMenu.addEventListener('click', ()=>{ soundTick(); renderLB(); showScreen(screenStart); });

// ── KEYBOARD ─────────────────────────────────────────────────
btnGuess.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', e=>{ if(e.key==='Enter') handleGuess(); });
document.addEventListener('keydown', e=>{
  if(e.key==='Escape'){
    if(!screenPause.classList.contains('hidden')){ btnResume.click(); }
    else if(!screenGame.classList.contains('hidden')&&!gameOver){ btnPause.click(); }
  }
});

// ── INJECT RANGE FLASH KEYFRAME ───────────────────────────────
const ks=document.createElement('style');
ks.textContent=`
@keyframes rangeFlash {
  0%   { color: var(--neon); transform: scale(1.15); }
  100% { color: var(--neon); transform: scale(1); }
}`;
document.head.appendChild(ks);

// ── INIT ──────────────────────────────────────────────────────
renderLB();
showScreen(screenStart);