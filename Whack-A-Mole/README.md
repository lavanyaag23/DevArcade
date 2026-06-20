<div align="center">

# ⚡ Whack-A-Mole

### A neon-glow reflex game — built with vanilla HTML, CSS & JS

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

A **Whack-A-Mole** reflex game with a glassmorphic dark/purple UI, three difficulty levels, a live countdown timer, and persisted best scores. No build tools, no dependencies beyond a Google Font.

## ✨ Features

- 🎚️ **Three difficulty levels** — Easy, Medium, Hard, each tuning how fast and how briefly the mole appears
- 🟢 **Glowing active holes** — the live hole lights up green with a bounce-up mole animation
- 💥 **Whack feedback** — a satisfying squish animation plus a purple/green particle burst on every hit
- ⏱️ **Live stats** — score and countdown timer update in real time
- 🏆 **Best score tracking** — highest score per difficulty, persisted with `localStorage`
- 🏁 **End-of-round modal** — final score, a "New Best!" badge when you beat your record, and a Play Again button
- 🔒 **Locked settings mid-round** — difficulty and Start are disabled while a round is active
- 🔊 **Procedural sound effects** — whack and game-over tones via the Web Audio API
- 🌌 **Glassmorphic dark theme** with ambient purple glow, matching the rest of the project suite

## 🖼️ Preview

> *Add a screenshot or GIF of the game here, e.g.* `![preview](preview.png)`

## 🗂️ Project Structure

```
whack-a-mole/
├── index.html      # Markup
├── style.css         # Theme, layout, hole & mole animations
├── script.js          # Game loop, spawning, scoring, sound
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
   git clone https://github.com/lavanyaag23/whack-a-mole.git
   cd whack-a-mole
   ```
2. **Open it**
   Just open `index.html` in your browser — no server or build step required.
   ```bash
   open index.html   # macOS
   start index.html  # Windows
   ```

## 🎯 How to Play

1. Pick a difficulty — **Easy**, **Medium**, or **Hard**.
2. Hit **Start Game** — the countdown begins and moles start popping up.
3. Click or tap a mole the instant it appears to score a point.
4. Score as many hits as you can before time runs out.
5. Beat your best score for the selected difficulty to set a new record.

## 🧭 Roadmap

- [ ] Combo / streak multiplier
- [ ] Decoy moles that cost points if whacked
- [ ] Two-player split-screen mode
- [ ] Light theme toggle

## 📄 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">

Built by **[Lavanya Agrawal](https://lavanyaagrawal.vercel.app)** · [GitHub](https://github.com/lavanyaag23)

</div>
