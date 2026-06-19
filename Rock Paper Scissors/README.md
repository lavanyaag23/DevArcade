<div align="center">

# ⚔️ Rock Paper Scissors

### A dark, purple-glow take on the classic hand game — built with vanilla HTML, CSS & JS

[![Made with HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![Made with CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![Made with JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](#)
[![No Frameworks](https://img.shields.io/badge/Frameworks-None-a855f7?style=for-the-badge)](#)

![Status](https://img.shields.io/badge/status-active-a855f7?style=flat-square)
![Made with](https://img.shields.io/badge/made%20with-%E2%9D%A4-c084fc?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-1c1336?style=flat-square)

</div>

---

## 🎮 About

A polished, single-purpose **Rock Paper Scissors** game with a glassmorphic dark/purple UI, an animated "VS" duel arena, glowing win/lose/tie states, a live scoreboard, win-streak tracking, particle bursts, and sound feedback — all in plain HTML, CSS, and JS. No build tools, no dependencies beyond a Google Font.

## ✨ Features

- 🪨📄✂️ Classic Rock / Paper / Scissors gameplay
- ⚡ Animated "shake → reveal" duel sequence before each result
- 🟣 Glassmorphic dark theme with purple ambient glow and conic gradient shimmer
- 🟢🔴🟡 Color-coded win / lose / tie glow states
- 🔥 Win-streak tracker with a persisted best streak
- 🎉 Particle burst animation on every win
- 🔊 Procedural sound effects via the Web Audio API (no audio files)
- 💾 Score and streak persistence with `localStorage`
- 📱 Responsive down to small mobile widths

## 🖼️ Preview

> *Add a screenshot or GIF of the game here, e.g.* `![preview](preview.png)`

## 🗂️ Project Structure

```
rock-paper-scissors/
├── index.html      # Markup
├── style.css        # Theme, layout, and animations
├── script.js         # Game logic, scoring, sound, storage
└── README.md
```

## 🛠️ Tech Stack

| Layer       | Tech                          |
|-------------|--------------------------------|
| Structure   | HTML5                          |
| Styling     | CSS3 (custom properties, keyframes, gradients) |
| Logic       | Vanilla JavaScript (ES6+)      |
| Audio       | Web Audio API                  |
| Storage     | `localStorage`                 |
| Font        | Space Grotesk + Inter (Google Fonts) |

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/lavanyaag23/rock-paper-scissors.git
   cd rock-paper-scissors
   ```
2. **Open it**
   Just open `index.html` in your browser — no server or build step required.
   ```bash
   open index.html   # macOS
   start index.html  # Windows
   ```

## 🎯 How to Play

1. Pick **Rock**, **Paper**, or **Scissors**.
2. Watch the duel animation play out against the computer's pick.
3. Win streaks light up 🔥 — your best streak is remembered between sessions.
4. Hit **Reset Match** to clear the current scoreboard.

## 🧭 Roadmap

- [ ] Best-of-N match mode
- [ ] Difficulty levels (random / pattern-adaptive AI)
- [ ] Light theme toggle
- [ ] Global leaderboard

## 📄 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">

Built by **[Lavanya Agrawal](https://lavanyaagrawal.vercel.app)** · [GitHub](https://github.com/lavanyaag23)

</div>