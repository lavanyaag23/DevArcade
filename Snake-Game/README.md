<div align="center">

# 🐍 Snake Game

### A neon-glow take on the classic Snake — built with vanilla HTML, CSS & JS

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

A **Snake Game** rebuilt with a glassmorphic dark/purple UI on top of an HTML5 canvas board — glowing snake and food, a speed ramp that ramps up as you score, touch + keyboard controls, and persisted high scores. No build tools, no dependencies beyond a Google Font.

## ✨ Features

- 🟣 Glowing purple snake that fades from head to tail
- 🟥 Pulsing rose-pink food square
- ⌨️ Arrow key / WASD controls
- 📱 Swipe-to-steer on touch devices, plus an auto-shown on-screen D-pad
- 🚀 Progressive speed ramp as your score climbs
- 🏆 Best score persisted with `localStorage`
- 🪟 "Press to start" and "Game Over" overlays instead of browser alerts
- 🔊 Procedural eat / game-over sound effects via the Web Audio API
- 🌌 Glassmorphic dark theme with ambient purple glow, matching the rest of the project suite

## 🖼️ Preview

> *Add a screenshot or GIF of the game here, e.g.* `![preview](preview.png)`

## 🗂️ Project Structure

```
snake-game/
├── index.html      # Markup
├── style.css         # Theme, layout, and animations
├── script.js          # Game loop, controls, scoring, sound
└── README.md
```

## 🛠️ Tech Stack

| Layer       | Tech                              |
|-------------|------------------------------------|
| Structure   | HTML5 + Canvas API                 |
| Styling     | CSS3 (custom properties, gradients, glow) |
| Logic       | Vanilla JavaScript (ES6+)          |
| Audio       | Web Audio API                      |
| Storage     | `localStorage`                     |
| Font        | Space Grotesk + Inter (Google Fonts) |

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/lavanyaag23/snake-game.git
   cd snake-game
   ```
2. **Open it**
   Just open `index.html` in your browser — no server or build step required.
   ```bash
   open index.html   # macOS
   start index.html  # Windows
   ```

## 🎯 How to Play

1. Press any arrow key (or **W A S D**) to start moving.
2. Steer the snake into the glowing food square to grow and score.
3. Avoid hitting the walls or your own tail.
4. The board speeds up every 50 points — stay sharp.
5. On mobile, swipe on the board or use the on-screen D-pad.
6. Hit **Restart** anytime to reset the run.

## 🧭 Roadmap

- [ ] Wrap-around walls mode
- [ ] Obstacle / multi-food levels
- [ ] Difficulty presets (slow / normal / fast)
- [ ] Light theme toggle

## 📄 License

Licensed under the [MIT License](LICENSE).

---

<div align="center">

Built by **[Lavanya Agrawal](https://lavanyaagrawal.vercel.app)** · [GitHub](https://github.com/lavanyaag23)

</div>
