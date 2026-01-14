# 🎨 Echo Painter: The Geometry of Time

**Echo Painter** is a temporal puzzle game built with React, TypeScript, and the HTML5 Canvas API. Draw on the "Present" to create mathematical "Echoes" in the "Past" and "Future." Master 6 levels of geometric transformations where every stroke follows a different temporal rule.



## 🚀 Core Mechanics
The game challenges your spatial reasoning through six distinct coordinate transformation rules:
1. **Direct Echo:** Standard 1:1 movement across all timelines.
2. **Rotation (90°):** Strokes rotate around a central axis in side timelines.
3. **Vertical Mirror:** Timelines flip your drawing upside down.
4. **Diagonal Swap:** $X$ and $Y$ coordinates are inverted.
5. **Split Dimensions:** Strokes are offset horizontally by a fixed factor.
6. **Total Inversion:** A complex $180^\circ$ point-reflection through the center.

## ✨ Features
* **Real-time Preview System:** Uses `getImageData` and `putImageData` for smooth shape previews without "smearing."
* **Echo Engine:** Centralized coordinate translation logic for multi-canvas synchronization.
* **Dynamic Toolset:** Brush, Line, Rectangle, and Circle tools with pixel-perfect precision.
* **Responsive Design:** Optimized 3-canvas layout built with Tailwind CSS.

## 🛠️ Technical Stack
* **Framework:** React 18 (Vite)
* **Language:** TypeScript
* **Graphics:** HTML5 Canvas API
* **State Management:** React Hooks (`useRef` for high-frequency performance)

## 🕹️ How to Play
1. Observe the **Target** shapes on the Past, Present, and Future canvases.
2. Select a tool and color from the sidebar.
3. Draw on the **Center (Present)** canvas.
4. Watch your "Echoes" appear—match all three targets to clear the level!

## 📦 Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to launch the game.

---
📧 Contact: giangvanhung@gmail.com