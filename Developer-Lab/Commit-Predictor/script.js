const STORAGE_KEY = 'commitPredictorBest_v1';

// Each question shows a diff and asks: what conventional commit type is this?
// answer: one of feat | fix | refactor | chore | docs | perf | test | style
const ALL_QUESTIONS = [

  // ── EASY ──
  {
    difficulty: 'easy', answer: 'feat', file: 'src/App.js', meta: '+12 -0',
    description: 'Adds a brand-new dark mode toggle component to the navigation bar.',
    diff: [
      { t: 'hunk', code: '@@ -28,6 +28,18 @@ function Navbar() {' },
      { t: 'ctx', n: 28, code: '  return (' },
      { t: 'ctx', n: 29, code: '    <nav className="navbar">' },
      { t: 'add', n: 30, code: '      <DarkModeToggle' },
      { t: 'add', n: 31, code: '        enabled={darkMode}' },
      { t: 'add', n: 32, code: '        onToggle={setDarkMode}' },
      { t: 'add', n: 33, code: '      />' },
      { t: 'ctx', n: 34, code: '    </nav>' },
      { t: 'ctx', n: 35, code: '  );' },
    ],
    explanation: 'Adding a new feature (dark mode toggle) = `feat`.'
  },
  {
    difficulty: 'easy', answer: 'fix', file: 'utils/auth.js', meta: '+2 -2',
    description: 'Corrects a login bug where the session token was never saved.',
    diff: [
      { t: 'hunk', code: '@@ -14,8 +14,8 @@ async function login(user, pass) {' },
      { t: 'ctx', n: 14, code: '  const token = await fetchToken(user, pass);' },
      { t: 'del', n: 15, code: '  sessionStorage.removeItem("token");' },
      { t: 'add', n: 15, code: '  sessionStorage.setItem("token", token);' },
      { t: 'ctx', n: 16, code: '  return token;' },
    ],
    explanation: '`removeItem` was called instead of `setItem` — clearly a bug fix = `fix`.'
  },
  {
    difficulty: 'easy', answer: 'docs', file: 'README.md', meta: '+18 -3',
    description: 'Rewrites the installation section with detailed setup steps.',
    diff: [
      { t: 'hunk', code: '@@ -5,9 +5,24 @@ # My Project' },
      { t: 'del', n: 6, code: '## Install' },
      { t: 'del', n: 7, code: 'Run npm install.' },
      { t: 'add', n: 6, code: '## Installation' },
      { t: 'add', n: 7, code: '' },
      { t: 'add', n: 8, code: '### Prerequisites' },
      { t: 'add', n: 9, code: '- Node.js >= 18' },
      { t: 'add', n: 10, code: '- npm >= 9' },
      { t: 'add', n: 11, code: '' },
      { t: 'add', n: 12, code: '```bash' },
      { t: 'add', n: 13, code: 'npm install' },
      { t: 'add', n: 14, code: 'npm run dev' },
      { t: 'add', n: 15, code: '```' },
    ],
    explanation: 'Only documentation was changed — no code touched = `docs`.'
  },
  {
    difficulty: 'easy', answer: 'chore', file: 'package.json', meta: '+3 -3',
    description: 'Bumps three npm dependencies to their latest versions.',
    diff: [
      { t: 'hunk', code: '@@ -12,9 +12,9 @@ "dependencies": {' },
      { t: 'del', n: 13, code: '  "react": "^18.1.0",' },
      { t: 'add', n: 13, code: '  "react": "^18.3.0",' },
      { t: 'del', n: 14, code: '  "axios": "^1.3.4",' },
      { t: 'add', n: 14, code: '  "axios": "^1.6.8",' },
      { t: 'del', n: 15, code: '  "lodash": "^4.17.20"' },
      { t: 'add', n: 15, code: '  "lodash": "^4.17.21"' },
    ],
    explanation: 'Dependency version bumps don\'t affect app logic = `chore`.'
  },
  {
    difficulty: 'easy', answer: 'test', file: 'tests/cart.test.js', meta: '+22 -0',
    description: 'Adds unit tests for the shopping cart\'s addItem and removeItem functions.',
    diff: [
      { t: 'hunk', code: '@@ -0,0 +1,22 @@' },
      { t: 'add', n: 1, code: "describe('Cart', () => {" },
      { t: 'add', n: 2, code: "  it('adds item to cart', () => {" },
      { t: 'add', n: 3, code: '    const cart = new Cart();' },
      { t: 'add', n: 4, code: "    cart.addItem({ id: 1, name: 'Book' });" },
      { t: 'add', n: 5, code: '    expect(cart.items).toHaveLength(1);' },
      { t: 'add', n: 6, code: '  });' },
      { t: 'add', n: 7, code: '});' },
    ],
    explanation: 'Only test files were added — no production code changed = `test`.'
  },
  {
    difficulty: 'easy', answer: 'style', file: 'components/Button.css', meta: '+8 -8',
    description: 'Renames CSS classes from camelCase to kebab-case convention.',
    diff: [
      { t: 'hunk', code: '@@ -1,8 +1,8 @@' },
      { t: 'del', n: 1, code: '.primaryBtn { background: blue; }' },
      { t: 'add', n: 1, code: '.primary-btn { background: blue; }' },
      { t: 'del', n: 2, code: '.primaryBtn:hover { opacity: 0.8; }' },
      { t: 'add', n: 2, code: '.primary-btn:hover { opacity: 0.8; }' },
      { t: 'del', n: 3, code: '.dangerBtn { background: red; }' },
      { t: 'add', n: 3, code: '.danger-btn { background: red; }' },
    ],
    explanation: 'Purely cosmetic class name change, no logic change = `style`.'
  },

  // ── MEDIUM ──
  {
    difficulty: 'medium', answer: 'refactor', file: 'api/users.js', meta: '+10 -18',
    description: 'Replaces a deeply nested callback chain with async/await.',
    diff: [
      { t: 'hunk', code: '@@ -4,18 +4,10 @@ function getUser(id) {' },
      { t: 'del', n: 4, code: '  return fetch(`/users/${id}`)' },
      { t: 'del', n: 5, code: '    .then(res => res.json())' },
      { t: 'del', n: 6, code: '    .then(data => {' },
      { t: 'del', n: 7, code: '      return processUser(data);' },
      { t: 'del', n: 8, code: '    })' },
      { t: 'del', n: 9, code: '    .catch(err => { throw err; });' },
      { t: 'add', n: 4, code: '  const res = await fetch(`/users/${id}`);' },
      { t: 'add', n: 5, code: '  const data = await res.json();' },
      { t: 'add', n: 6, code: '  return processUser(data);' },
    ],
    explanation: 'Behavior is identical — only internal structure improved = `refactor`.'
  },
  {
    difficulty: 'medium', answer: 'perf', file: 'src/search.js', meta: '+6 -4',
    description: 'Adds debouncing to the search input to reduce unnecessary API calls.',
    diff: [
      { t: 'hunk', code: '@@ -8,8 +8,10 @@ function SearchBar() {' },
      { t: 'del', n: 9, code: '  const handleChange = (e) => {' },
      { t: 'del', n: 10, code: '    setQuery(e.target.value);' },
      { t: 'del', n: 11, code: '    fetchResults(e.target.value);' },
      { t: 'del', n: 12, code: '  };' },
      { t: 'add', n: 9, code: '  const handleChange = debounce((e) => {' },
      { t: 'add', n: 10, code: '    setQuery(e.target.value);' },
      { t: 'add', n: 11, code: '    fetchResults(e.target.value);' },
      { t: 'add', n: 12, code: '  }, 300);' },
    ],
    explanation: 'Debouncing reduces API calls — this is a performance improvement = `perf`.'
  },
  {
    difficulty: 'medium', answer: 'feat', file: 'src/notifications.js', meta: '+34 -0',
    description: 'Adds a full push notification subscription flow with permission handling.',
    diff: [
      { t: 'hunk', code: '@@ -0,0 +1,34 @@' },
      { t: 'add', n: 1, code: 'export async function subscribeToPush() {' },
      { t: 'add', n: 2, code: "  const perm = await Notification.requestPermission();" },
      { t: 'add', n: 3, code: "  if (perm !== 'granted') return null;" },
      { t: 'add', n: 4, code: '  const reg = await navigator.serviceWorker.ready;' },
      { t: 'add', n: 5, code: '  const sub = await reg.pushManager.subscribe({' },
      { t: 'add', n: 6, code: "    userVisibleOnly: true," },
      { t: 'add', n: 7, code: '    applicationServerKey: VAPID_KEY' },
      { t: 'add', n: 8, code: '  });' },
      { t: 'add', n: 9, code: '  return sub;' },
      { t: 'add', n: 10, code: '}' },
    ],
    explanation: 'A whole new capability added from scratch = `feat`.'
  },
  {
    difficulty: 'medium', answer: 'fix', file: 'hooks/useTimer.js', meta: '+4 -1',
    description: 'Clears the interval on component unmount to fix a memory leak.',
    diff: [
      { t: 'hunk', code: '@@ -10,7 +10,10 @@ function useTimer() {' },
      { t: 'ctx', n: 10, code: '  useEffect(() => {' },
      { t: 'ctx', n: 11, code: '    const id = setInterval(tick, 1000);' },
      { t: 'del', n: 12, code: '  }, []);' },
      { t: 'add', n: 12, code: '    return () => clearInterval(id);' },
      { t: 'add', n: 13, code: '  }, []);' },
    ],
    explanation: 'Forgetting to clear an interval causes a memory leak — this is a `fix`.'
  },
  {
    difficulty: 'medium', answer: 'chore', file: '.eslintrc.json', meta: '+14 -0',
    description: 'Adds an ESLint config with React and accessibility rules.',
    diff: [
      { t: 'hunk', code: '@@ -0,0 +1,14 @@' },
      { t: 'add', n: 1, code: '{' },
      { t: 'add', n: 2, code: '  "extends": [' },
      { t: 'add', n: 3, code: '    "eslint:recommended",' },
      { t: 'add', n: 4, code: '    "plugin:react/recommended",' },
      { t: 'add', n: 5, code: '    "plugin:jsx-a11y/recommended"' },
      { t: 'add', n: 6, code: '  ],' },
      { t: 'add', n: 7, code: '  "rules": {' },
      { t: 'add', n: 8, code: '    "no-unused-vars": "warn"' },
      { t: 'add', n: 9, code: '  }' },
      { t: 'add', n: 10, code: '}' },
    ],
    explanation: 'Tooling/config setup that doesn\'t change app behavior = `chore`.'
  },
  {
    difficulty: 'medium', answer: 'refactor', file: 'store/cartSlice.js', meta: '+20 -28',
    description: 'Migrates cart state from useState chains to a single useReducer.',
    diff: [
      { t: 'hunk', code: '@@ -3,15 +3,12 @@ function Cart() {' },
      { t: 'del', n: 3, code: '  const [items, setItems] = useState([]);' },
      { t: 'del', n: 4, code: '  const [total, setTotal] = useState(0);' },
      { t: 'del', n: 5, code: '  const [count, setCount] = useState(0);' },
      { t: 'add', n: 3, code: '  const [state, dispatch] = useReducer(cartReducer, {' },
      { t: 'add', n: 4, code: '    items: [], total: 0, count: 0' },
      { t: 'add', n: 5, code: '  });' },
    ],
    explanation: 'Same behavior, better state management pattern = `refactor`.'
  },

  // ── HARD ──
  {
    difficulty: 'hard', answer: 'perf', file: 'components/List.jsx', meta: '+5 -3',
    description: 'Wraps an expensive list component in React.memo to prevent unnecessary re-renders.',
    diff: [
      { t: 'hunk', code: '@@ -1,8 +1,10 @@' },
      { t: 'del', n: 1, code: 'function ExpensiveList({ items }) {' },
      { t: 'del', n: 2, code: '  return items.map(i => <Item key={i.id} {...i} />);' },
      { t: 'del', n: 3, code: '}' },
      { t: 'del', n: 4, code: 'export default ExpensiveList;' },
      { t: 'add', n: 1, code: 'const ExpensiveList = React.memo(({ items }) => {' },
      { t: 'add', n: 2, code: '  return items.map(i => <Item key={i.id} {...i} />);' },
      { t: 'add', n: 3, code: '});' },
      { t: 'add', n: 4, code: 'export default ExpensiveList;' },
    ],
    explanation: 'React.memo skips re-renders when props haven\'t changed — this is `perf`, not `refactor`. Behavior is identical but runtime performance improves.'
  },
  {
    difficulty: 'hard', answer: 'fix', file: 'middleware/cors.js', meta: '+3 -1',
    description: 'Fixes a CORS config that was blocking requests from the mobile app origin.',
    diff: [
      { t: 'hunk', code: '@@ -4,6 +4,8 @@ app.use(cors({' },
      { t: 'del', n: 5, code: "  origin: 'https://web.myapp.com'," },
      { t: 'add', n: 5, code: '  origin: [' },
      { t: 'add', n: 6, code: "    'https://web.myapp.com'," },
      { t: 'add', n: 7, code: "    'https://mobile.myapp.com'" },
      { t: 'add', n: 8, code: '  ],' },
      { t: 'ctx', n: 9, code: '  credentials: true,' },
    ],
    explanation: 'The mobile origin was mistakenly blocked — an unintended behavior = `fix`, not `feat`. No new feature was designed; something broken was repaired.'
  },
  {
    difficulty: 'hard', answer: 'refactor', file: 'services/email.js', meta: '+15 -15',
    description: 'Splits a 200-line sendEmail function into smaller single-responsibility helpers.',
    diff: [
      { t: 'hunk', code: '@@ -1,12 +1,12 @@' },
      { t: 'del', n: 1, code: 'async function sendEmail(to, subject, body, opts) {' },
      { t: 'del', n: 2, code: '  // validate, build headers, render template,' },
      { t: 'del', n: 3, code: '  // attach files, send, log — all in one function' },
      { t: 'add', n: 1, code: 'async function sendEmail(to, subject, body, opts) {' },
      { t: 'add', n: 2, code: '  const headers = buildHeaders(to, subject, opts);' },
      { t: 'add', n: 3, code: '  const html = await renderTemplate(body, opts);' },
      { t: 'add', n: 4, code: '  const payload = attachFiles(html, opts.attachments);' },
      { t: 'add', n: 5, code: '  await transport.send({ headers, payload });' },
      { t: 'add', n: 6, code: '  logDelivery(to, subject);' },
      { t: 'add', n: 7, code: '}' },
    ],
    explanation: 'Behavior unchanged, code structure improved = `refactor`. This is the key `refactor` vs `feat` distinction.'
  },
  {
    difficulty: 'hard', answer: 'feat', file: 'api/export.js', meta: '+45 -0',
    description: 'Adds a new /export endpoint that streams data as a CSV download.',
    diff: [
      { t: 'hunk', code: '@@ -0,0 +1,45 @@' },
      { t: 'add', n: 1, code: "router.get('/export', async (req, res) => {" },
      { t: 'add', n: 2, code: "  res.setHeader('Content-Type', 'text/csv');" },
      { t: 'add', n: 3, code: "  res.setHeader('Content-Disposition'," },
      { t: 'add', n: 4, code: "    'attachment; filename=\"data.csv\"');" },
      { t: 'add', n: 5, code: '  const stream = db.createReadStream(req.query);' },
      { t: 'add', n: 6, code: '  stream.pipe(csvTransform).pipe(res);' },
      { t: 'add', n: 7, code: '});' },
    ],
    explanation: 'A new endpoint that did not exist before = `feat`. Adding net-new capability always maps to `feat`.'
  },
  {
    difficulty: 'hard', answer: 'chore', file: 'Dockerfile', meta: '+28 -0',
    description: 'Adds a multi-stage Dockerfile to containerize the Node.js service.',
    diff: [
      { t: 'hunk', code: '@@ -0,0 +1,28 @@' },
      { t: 'add', n: 1, code: 'FROM node:20-alpine AS builder' },
      { t: 'add', n: 2, code: 'WORKDIR /app' },
      { t: 'add', n: 3, code: 'COPY package*.json ./' },
      { t: 'add', n: 4, code: 'RUN npm ci' },
      { t: 'add', n: 5, code: 'COPY . .' },
      { t: 'add', n: 6, code: 'RUN npm run build' },
      { t: 'add', n: 7, code: '' },
      { t: 'add', n: 8, code: 'FROM node:20-alpine' },
      { t: 'add', n: 9, code: 'COPY --from=builder /app/dist ./dist' },
      { t: 'add', n: 10, code: 'CMD ["node", "dist/server.js"]' },
    ],
    explanation: 'Infrastructure config that doesn\'t change app logic or add a user-facing feature = `chore`.'
  },
  {
    difficulty: 'hard', answer: 'fix', file: 'hooks/useLocalStorage.js', meta: '+8 -3',
    description: 'Wraps the localStorage.getItem call in a try-catch so SSR doesn\'t crash.',
    diff: [
      { t: 'hunk', code: '@@ -2,7 +2,12 @@ function useLocalStorage(key, init) {' },
      { t: 'del', n: 3, code: '  const stored = localStorage.getItem(key);' },
      { t: 'del', n: 4, code: '  const [val, setVal] = useState(stored ?? init);' },
      { t: 'add', n: 3, code: '  const [val, setVal] = useState(() => {' },
      { t: 'add', n: 4, code: '    try {' },
      { t: 'add', n: 5, code: '      return JSON.parse(localStorage.getItem(key)) ?? init;' },
      { t: 'add', n: 6, code: '    } catch {' },
      { t: 'add', n: 7, code: '      return init;' },
      { t: 'add', n: 8, code: '    }' },
      { t: 'add', n: 9, code: '  });' },
    ],
    explanation: '`localStorage` doesn\'t exist in SSR/Node — the crash was a bug. Guarding it = `fix`, not `refactor`.'
  },
  {
    difficulty: 'hard', answer: 'perf', file: 'db/queries.js', meta: '+4 -4',
    description: 'Replaces an N+1 query loop with a single batched SQL query.',
    diff: [
      { t: 'hunk', code: '@@ -8,8 +8,8 @@ async function getUserPosts(userIds) {' },
      { t: 'del', n: 9, code: '  const posts = [];' },
      { t: 'del', n: 10, code: '  for (const id of userIds) {' },
      { t: 'del', n: 11, code: '    posts.push(await db.query(`SELECT * FROM posts WHERE user_id=${id}`));' },
      { t: 'del', n: 12, code: '  }' },
      { t: 'add', n: 9, code: '  const posts = await db.query(' },
      { t: 'add', n: 10, code: '    `SELECT * FROM posts WHERE user_id IN (${userIds.join(",")})` ' },
      { t: 'add', n: 11, code: '  );' },
    ],
    explanation: 'Eliminating N+1 queries is a classic database performance fix = `perf`. The output is identical but far fewer queries are made.'
  },
  {
    difficulty: 'hard', answer: 'test', file: 'tests/auth.integration.test.js', meta: '+55 -0',
    description: 'Adds integration tests for the login, logout, and token refresh flows.',
    diff: [
      { t: 'hunk', code: '@@ -0,0 +1,55 @@' },
      { t: 'add', n: 1, code: "describe('Auth integration', () => {" },
      { t: 'add', n: 2, code: "  it('issues a token on valid login', async () => {" },
      { t: 'add', n: 3, code: '    const res = await request(app)' },
      { t: 'add', n: 4, code: "      .post('/auth/login')" },
      { t: 'add', n: 5, code: "      .send({ email: 'u@e.com', password: 'pass' });" },
      { t: 'add', n: 6, code: '    expect(res.status).toBe(200);' },
      { t: 'add', n: 7, code: "    expect(res.body).toHaveProperty('token');" },
      { t: 'add', n: 8, code: '  });' },
      { t: 'add', n: 9, code: '});' },
    ],
    explanation: 'Only test files added — even complex ones = `test`.'
  }
];

const DIFFICULTY_CONFIG = {
  easy:   { count: 6,  pools: ['easy'],            timeLimit: 25, choices: 4 },
  medium: { count: 8,  pools: ['easy','medium'],   timeLimit: 20, choices: 6 },
  hard:   { count: 12, pools: ['medium','hard'],   timeLimit: 15, choices: 8 }
};

const ALL_TYPES = ['feat','fix','refactor','chore','docs','perf','test','style'];

const TYPE_DESC = {
  feat:     'New feature for the user',
  fix:      'Bug fix for the user',
  refactor: 'Code restructure, no behavior change',
  chore:    'Tooling, config, or maintenance',
  docs:     'Documentation only changes',
  perf:     'Performance improvement',
  test:     'Adding or fixing tests',
  style:    'Formatting, whitespace, naming'
};

// ── DOM ──
const roundStat  = document.getElementById('roundStat');
const scoreStat  = document.getElementById('scoreStat');
const streakStat = document.getElementById('streakStat');
const timerStat  = document.getElementById('timerStat');
const diffBtns   = document.querySelectorAll('.diff-btn');
const qHeader    = document.getElementById('questionHeader');
const qLabel     = document.getElementById('qLabel');
const qDesc      = document.getElementById('qDesc');
const diffPanel  = document.getElementById('diffPanel');
const diffFilename = document.getElementById('diffFilename');
const diffMeta   = document.getElementById('diffMeta');
const diffBody   = document.getElementById('diffBody');
const optionsGrid = document.getElementById('optionsGrid');
const feedbackBox = document.getElementById('feedbackBox');
const idleState  = document.getElementById('idleState');
const startBtn   = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const endOverlay = document.getElementById('endOverlay');
const finalScoreEl    = document.getElementById('finalScore');
const finalAccuracyEl = document.getElementById('finalAccuracy');
const finalStreakEl   = document.getElementById('finalStreak');
const finalBestEl     = document.getElementById('finalBest');
const verdictEl       = document.getElementById('verdict');
const newBestTag      = document.getElementById('newBestTag');
const playAgainBtn    = document.getElementById('playAgainBtn');

let bestRecords = loadBest();
let currentDiff = 'easy';
let questions   = [];
let qIndex      = 0;
let score       = 0;
let streak      = 0;
let bestStreak  = 0;
let correct     = 0;
let timeLeft    = 0;
let running     = false;
let awaitAnswer = false;
let timerInterval = null;
let advanceTimer  = null;
let audioCtx      = null;

updateBestDisplay();

diffBtns.forEach(btn => btn.addEventListener('click', () => {
  if (running || btn.dataset.diff === currentDiff) return;
  diffBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentDiff = btn.dataset.diff;
  updateBestDisplay();
}));

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', resetToIdle);
playAgainBtn.addEventListener('click', () => { hideOverlay(endOverlay); startGame(); });

function loadBest() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function saveBest() { localStorage.setItem(STORAGE_KEY, JSON.stringify(bestRecords)); }
function updateBestDisplay() {
  if (finalBestEl) finalBestEl.textContent = bestRecords[currentDiff] ?? '--';
}

function buildSet(diff) {
  const config = DIFFICULTY_CONFIG[diff];
  const pool = ALL_QUESTIONS.filter(q => config.pools.includes(q.difficulty));
  return shuffle([...pool]).slice(0, Math.min(config.count, pool.length));
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame() {
  running = true;
  questions = buildSet(currentDiff);
  qIndex = score = streak = bestStreak = correct = 0;
  scoreStat.textContent = '0';
  streakStat.textContent = '🔥 0';
  startBtn.disabled = true;
  restartBtn.disabled = false;
  diffBtns.forEach(b => b.disabled = true);
  idleState.classList.add('hidden');
  hideOverlay(endOverlay);
  loadQuestion(0);
}

function resetToIdle() {
  running = awaitAnswer = false;
  clearInterval(timerInterval);
  clearTimeout(advanceTimer);
  idleState.classList.remove('hidden');
  diffPanel.classList.add('hidden');
  optionsGrid.classList.add('hidden');
  qHeader.classList.add('hidden');
  feedbackBox.classList.add('hidden');
  timerStat.textContent = '--';
  timerStat.classList.remove('danger');
  roundStat.textContent = `1/${DIFFICULTY_CONFIG[currentDiff].count}`;
  scoreStat.textContent = '0';
  streakStat.textContent = '🔥 0';
  startBtn.disabled = false;
  restartBtn.disabled = true;
  diffBtns.forEach(b => b.disabled = false);
  hideOverlay(endOverlay);
}

function loadQuestion(index) {
  if (index >= questions.length) { finishGame(); return; }

  const q = questions[index];
  const config = DIFFICULTY_CONFIG[currentDiff];

  awaitAnswer = true;
  timeLeft = config.timeLimit;

  feedbackBox.className = 'feedback-box hidden';
  qHeader.classList.remove('hidden');
  diffPanel.classList.remove('hidden');
  optionsGrid.classList.remove('hidden');

  qLabel.textContent = `Q${index + 1}`;
  qDesc.textContent = q.description;
  roundStat.textContent = `${index + 1}/${questions.length}`;

  diffFilename.textContent = q.file;
  diffMeta.textContent = q.meta;
  renderDiff(q.diff);
  renderOptions(q, config.choices);
  updateTimerDisplay();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) { clearInterval(timerInterval); handleTimeout(); }
  }, 1000);
}

function renderDiff(lines) {
  diffBody.innerHTML = '';
  lines.forEach(({ t, n, code }) => {
    const row = document.createElement('div');
    row.className = `diff-line ${t}`;
    const sign = t === 'add' ? '+' : t === 'del' ? '-' : t === 'hunk' ? '' : ' ';
    const numHtml = t === 'hunk' ? '' : `<span class="dl-num">${n ?? ''}</span>`;
    row.innerHTML = `${numHtml}<span class="dl-sign">${sign}</span><span class="dl-code">${code}</span>`;
    diffBody.appendChild(row);
  });
}

function renderOptions(q, count) {
  optionsGrid.innerHTML = '';
  const pool = ALL_TYPES.includes(q.answer)
    ? [q.answer, ...shuffle(ALL_TYPES.filter(t => t !== q.answer)).slice(0, count - 1)]
    : ALL_TYPES.slice(0, count);
  shuffle(pool).forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.type = type;
    btn.innerHTML = `
      <span class="badge badge-${type}">${type}</span>
      <span class="option-desc">${TYPE_DESC[type]}</span>
    `;
    btn.addEventListener('click', () => onAnswer(type, btn, q));
    optionsGrid.appendChild(btn);
  });
}

function onAnswer(type, btn, q) {
  if (!awaitAnswer) return;
  awaitAnswer = false;
  clearInterval(timerInterval);

  const allBtns = optionsGrid.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  if (type === q.answer) {
    btn.classList.add('correct');
    const bonus = Math.max(20, 50 + timeLeft * 3);
    score += bonus;
    streak++;
    bestStreak = Math.max(bestStreak, streak);
    correct++;
    scoreStat.textContent = score;
    streakStat.textContent = `🔥 ${streak}`;
    bumpUpdate(scoreStat);
    bumpUpdate(streakStat);
    soundCorrect();
    showFeedback('success', `✅ Correct! +${bonus} pts`, q.explanation);
  } else {
    btn.classList.add('wrong');
    // reveal the right answer
    allBtns.forEach(b => { if (b.dataset.type === q.answer) b.classList.add('revealed'); });
    streak = 0;
    streakStat.textContent = '🔥 0';
    soundWrong();
    showFeedback('fail', `❌ That's ${type} — the answer was <strong>${q.answer}</strong>`, q.explanation);
  }

  advanceTimer = setTimeout(() => { qIndex++; loadQuestion(qIndex); }, 2200);
}

function handleTimeout() {
  awaitAnswer = false;
  const q = questions[qIndex];
  const allBtns = optionsGrid.querySelectorAll('.option-btn');
  allBtns.forEach(b => {
    b.disabled = true;
    if (b.dataset.type === q.answer) b.classList.add('revealed');
  });
  streak = 0;
  streakStat.textContent = '🔥 0';
  soundTimeout();
  showFeedback('timeout', `⏰ Time's up! Answer: <strong>${q.answer}</strong>`, q.explanation);
  advanceTimer = setTimeout(() => { qIndex++; loadQuestion(qIndex); }, 2400);
}

function showFeedback(type, title, explain) {
  feedbackBox.classList.remove('hidden');
  feedbackBox.className = `feedback-box ${type}`;
  feedbackBox.innerHTML = `<strong>${title}</strong><p>${explain}</p>`;
}

function finishGame() {
  running = false;
  clearInterval(timerInterval);
  clearTimeout(advanceTimer);
  diffPanel.classList.add('hidden');
  optionsGrid.classList.add('hidden');
  qHeader.classList.add('hidden');
  feedbackBox.classList.add('hidden');
  idleState.classList.remove('hidden');
  timerStat.textContent = '--';
  timerStat.classList.remove('danger');
  startBtn.disabled = false;
  restartBtn.disabled = true;
  diffBtns.forEach(b => b.disabled = false);

  const accuracy = Math.round((correct / questions.length) * 100);
  const isNewBest = !bestRecords[currentDiff] || score > bestRecords[currentDiff];
  if (isNewBest) { bestRecords[currentDiff] = score; saveBest(); }

  finalScoreEl.textContent = score;
  finalAccuracyEl.textContent = `${accuracy}%`;
  finalStreakEl.textContent = bestStreak;
  finalBestEl.textContent = bestRecords[currentDiff];
  newBestTag.classList.toggle('hidden', !isNewBest);

  const verdicts = [
    [100, '🧠 Perfect! You think like a senior dev.'],
    [80,  '💪 Solid debugging instincts.'],
    [60,  '📖 Good effort — review the tricky types.'],
    [0,   '🌱 Keep going! Conventional commits take practice.']
  ];
  verdictEl.textContent = verdicts.find(([min]) => accuracy >= min)[1];

  soundFinish();
  setTimeout(() => showOverlay(endOverlay), 400);
}

function updateTimerDisplay() {
  timerStat.textContent = `${timeLeft}s`;
  timerStat.classList.toggle('danger', timeLeft <= 5);
}

function bumpUpdate(el) {
  el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
}

function showOverlay(el) { el.classList.remove('hidden'); }
function hideOverlay(el) { el.classList.add('hidden'); }

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freqs, dur = 0.1) {
  try {
    const ctx = getAudioCtx();
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.07, ctx.currentTime + i * dur);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * dur);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * dur);
      osc.stop(ctx.currentTime + (i + 1) * dur);
    });
  } catch {}
}

function soundCorrect()  { playTone([660, 880, 1100], 0.08); }
function soundWrong()    { playTone([260, 200], 0.07); }
function soundTimeout()  { playTone([392, 311], 0.12); }
function soundFinish()   { playTone([523, 659, 784, 1047], 0.14); }