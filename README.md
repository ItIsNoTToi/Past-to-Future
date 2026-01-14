# 🎨 Echo Painter:
* The Geometry of TimeEcho Painter is a logic-based drawing puzzle game built with React, TypeScript, and the HTML5 Canvas API.
* Players must recreate target patterns by drawing on the "Present" canvas. However, there’s a twist: every stroke you make is "echoed" onto the "Past" and "Future" canvases according to specific mathematical and temporal rules. To win, you must master how coordinates transform across dimensions.
## 🚀 Core Mechanics
  The game challenges your spatial reasoning through six distinct levels of coordinate transformation:
  1. Direct Echo: Standard 1:1 movement across all timelines.
  2. Rotation (90°): The Past and Future rotate your strokes around a central axis.
  3. Vertical Mirror: The timelines flip your drawing upside down.
  4. Diagonal Swap: $X$ and $Y$ coordinates are inverted, turning horizontal lines into vertical ones.
  5. Split Dimensions: Strokes are offset horizontally, requiring you to account for "spatial drift."
  6. Total Inversion: A complex point-reflection ($180^\circ$ rotation) through the center.
## ✨ Features
  * Real-time Preview System: Custom-built snapshot logic using getImageData and putImageData to allow for smooth Line, Rectangle, and Circle previews without "smearing" the canvas.
  * Echo Engine: A centralized applyTimeRule system that handles complex geometric translations across multiple canvas instances.
  * Dynamic Toolset: Support for Brush, Line, Rectangle, and Circle tools with pixel-perfect precision.
  * Audio Feedback: Immersive sound effects synchronized with drawing actions.
  * Responsive Design: Optimized for a tight, 3-canvas layout using Tailwind CSS.
## 🛠️ Technical Stack
  Framework: React 18
  Language: TypeScript (Strictly typed for canvas events and coordinate objects)
  Graphics: HTML5 Canvas API
  Styling: Tailwind CSS
  State Management: React Hooks (useRef for high-frequency canvas updates to prevent unnecessary re-renders).
## 🕹️ How to Play
  1. Observe the Target shapes faintly visible on the Past, Present, and Future canvases.
  2. Select a tool (Brush, Line, Rect, Circle) and a color.
  3. Draw on the Center (Present) canvas.
  4. Watch your "Echoes" appear on the side canvases.
  5. Match all three targets perfectly to clear the level!

**Echo Painter** is a temporal puzzle game built with React, TS, and Canvas API. Draw on the "Present" to create mathematical "Echoes" in the "Past" and "Future." Master 6 levels of geometric transformations like 90° rotations, mirroring, and point-inversion. Features real-time shape previews and a custom coordinate translation engine.

## ✨ Key Features
* **Temporal Drawing:** Your strokes are transformed in real-time across three canvases.
* **6 Mathematical Levels:** Challenges including vertical flips, X/Y swaps, and point reflections.
* **Precision Tools:** Brush, Line, Rectangle, and Circle with live preview logic.
* **Snapshot System:** Uses `getImageData` to allow shape previews without canvas "smearing."

## 🚀 Quick Start

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/echo-painter.git](https://github.com/your-username/echo-painter.git)

# giangvanhung@gmail.com

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
