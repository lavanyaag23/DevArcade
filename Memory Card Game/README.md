<div align="center">

# 🧠 Memory Card Game

### A neon-glow card matching game — built with vanilla HTML, CSS & JS

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

A **Memory Card Game** with a glassmorphic dark/purple UI, real 3D card-flip animations, three difficulty levels, a live timer, and persisted best scores. No build tools, no dependencies beyond a Google Font.

## ✨ Features

- 🎚️ **Three difficulty levels** — Easy (6 pairs), Medium (8 pairs), Hard (12 pairs), each with its own grid layout
- 🔄 **3D flip animation** — real perspective flip on every card, not just a swap
- 🟢 **Match / mismatch feedback** — matched pairs glow and pulse green, mismatches shake before flipping back
- ⏱️ **Live stats** — move counter and timer (starts on your first flip)
- 🏆 **Best score tracking** — fewest moves per difficulty, persisted with `localStorage`
- 🎉 **Win modal** — final moves/time, a "New Best!" badge when you beat your record, and a confetti burst
- 🔊 **Procedural sound effects** — flip, match, mismatch, and win tones via the Web Audio API
- 🌌 **Glassmorphic dark theme** with ambient purple glow, matching the rest of the project suite

## 🖼️ Preview

> *Add a screenshot or GIF of the game here, e.g.* `![preview](preview.png)`

## 🗂️ Project Structure

```
memory-card-game/
├── index.html      # Markup
├── style.css         # Theme, layout, flip & glow animations
├── script.js          # Game logic, scoring, timer, sound
└── README.md
```

## 🛠️ Tech Stack

| Layer       | Tech                              |
|-------------|------------------------------------|
| Structure   | HTML5                              |
| Styling     | CSS3 (custom properties, 3D transforms, gradients) |
| Logic       | Vanilla JavaScript (ES6+)          |
| Audio       | Web Audio API                      |
| Storage     | `localStorage`                     |
| Font        | Space Grotesk + Inter (Google Fonts) |

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/lavanyaag23/memory-card-game.git
   cd memory-card-game
   ```
2. **Open it**
   Just open `index.html` in your browser — no server or build step required.
   ```bash
   open index.html   # macOS
   start index.html  # Windows
   ```

## 🎯 How to Play

1. Pick a difficulty — **Easy**, **Medium**, or **Hard**.
2. Flip two cards per turn to find a matching pair.
3. Matched pairs glow green and stay face-up; mismatches shake and flip back.
4. Match every pair in the fewest moves and the least time to beat your best.
5. Hit **Restart Game** anytime to reshuffle the current difficulty.

## 🧭 Roadmap

- [ ] Two-player turn-based mode
- [ ] Custom card themes (emoji sets, icons, images)
- [ ] Global leaderboard
- [ ] Light theme toggle

## 📄 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">

Built by **[Lavanya Agrawal](https://lavanyaagrawal.vercel.app)** · [GitHub](https://github.com/lavanyaag23)

</div>
