<div align="center">

# 🎵 Simon Says

### A neon-glow memory sequence game — built with vanilla HTML, CSS & JS

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

A **Simon Says** sequence-memory game with a glassmorphic dark/purple UI wrapped around the classic four-color pad layout — glowing playback, a center level badge, increasing speed, and persisted best scores. No build tools, no dependencies beyond a Google Font.

## ✨ Features

- 🔴🟢🔵🟡 Classic four-pad layout with distinct tones per color
- 🟣 **Center level badge** — pulses on every level-up, like the real device's center button
- 📢 **Status text** — "Watch the pattern...", "Your turn!", "Level up!" keep the game state clear
- 💡 **Glowing playback** — pads dim at rest, light up bright with a colored glow during sequence playback and on your clicks
- 📈 **Progressive difficulty** — sequence playback speeds up slightly as levels climb
- 💥 **Mistake feedback** — the board shakes and buzzes on a wrong input instead of failing silently
- 🏆 **Best level tracking** — persisted with `localStorage`
- 🏁 **End-of-round modal** — shows the level reached, flags a "New Best!", and offers Play Again
- 🔊 **Procedural sound effects** — per-color tones and a game-over buzz via the Web Audio API
- 🌌 **Glassmorphic dark theme** with ambient purple glow, matching the rest of the project suite

## 🖼️ Preview

> *Add a screenshot or GIF of the game here, e.g.* `![preview](preview.png)`

## 🗂️ Project Structure

```
simon-says/
├── index.html      # Markup
├── style.css         # Theme, layout, pad & badge animations
├── script.js          # Sequence logic, input checking, sound
└── README.md
```

## 🛠️ Tech Stack

| Layer       | Tech                              |
|-------------|------------------------------------|
| Structure   | HTML5                              |
| Styling     | CSS3 (custom properties, gradients, glow) |
| Logic       | Vanilla JavaScript (ES6+)          |
| Audio       | Web Audio API                      |
| Storage     | `localStorage`                     |
| Font        | Space Grotesk + Inter (Google Fonts) |

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/lavanyaag23/simon-says.git
   cd simon-says
   ```
2. **Open it**
   Just open `index.html` in your browser — no server or build step required.
   ```bash
   open index.html   # macOS
   start index.html  # Windows
   ```

## 🎯 How to Play

1. Hit **Start Game** — Simon plays a one-color sequence.
2. Watch the pattern, then repeat it by clicking the pads in the same order.
3. Get it right and the sequence grows by one color each round.
4. Click the wrong pad and it's game over — see how many levels you reached.
5. Beat your best level to set a new record.

## 🧭 Roadmap

- [ ] Strict mode (restart from level 1 on any mistake)
- [ ] Adjustable starting speed
- [ ] Two-player alternating-turn mode
- [ ] Light theme toggle

## 📄 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">

Built by **[Lavanya Agrawal](https://lavanyaagrawal.vercel.app)** · [GitHub](https://github.com/lavanyaag23)

</div>
