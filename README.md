# Tower Defence Game Using Java Swing with Intelligent Enemy Pathfinding

> **Academic Capstone Project Demonstration**  
> **Course:** CSA0913 – Programming in Java  
> **Supervisor:** Dr. MADHUMITHA K  
> **Student Investigators:**  
> - **G. Shiva Dhanasekhar** (Reg. No: 192311318)  
> - **G. Venu Gopal Reddy** (Reg. No: 192311303)  
> - **K. Omkar Eswar** (Reg. No: 192311431)  

---

## 1. Project Overview

This application is an academic, interactive demonstration of our Capstone Project: **“Tower Defence Game Using Java Swing with Intelligent Enemy Pathfinding”**. 

The fundamental research and curriculum focus of this project is exploring **Object-Oriented Programming (OOP)**, **Graph Search & Pathfinding Algorithms ($A^*$)**, real-time state machines, defensive turret combat dynamics, wave-based difficulty curves, and economy management.

### Relationship Between Java Swing and Web Demonstration
- **Original Project:** Developed natively using Java Swing (`JFrame`, `JPanel`, `Graphics2D`, `javax.swing.Timer`, and Java OOP classes).
- **Web Demonstration:** Re-implements and maps these exact same OOP models, mathematical formulas, and algorithmic state machines to a modern browser-based stack (**React 19 + TypeScript + HTML5 Canvas + Web Audio API**).
- **Algorithmic Parity:** Both implementations utilize the identical $A^*$ graph search algorithm with the Manhattan Distance heuristic ($F = G + H$), priority queue traversal, and dynamic path recalculation.

---

## 2. Core Features

1. **Interactive Strategic Game Engine:**
   - 900×600 HTML5 Canvas running at 60 FPS with sub-millisecond delta timing.
   - 18×12 configurable grid map with designated spawn rifts, defensive bastion emplacements, roads, and environmental obstacles.
   - Simulation speed controls (`0.5x`, `1.0x`, `2.0x`) and full pause/resume capabilities.

2. **Intelligent $A^*$ Pathfinding Engine:**
   - Full mathematical implementation of the $A^*$ search algorithm.
   - Open Set, Closed Set, parent tracking, and Manhattan distance heuristic ($H(n) = |x_1 - x_2| + |y_1 - y_2|$).
   - Dynamic path recalculation around obstacles.
   - **"SHOW $A^*$ PATH"** live battlefield visualization mode showing explored nodes, evaluated frontiers, and node costs ($G$, $H$, $F$).

3. **Multi-Class Defensive Towers:**
   - **Gatling Sentry (Basic Turret):** 100 coins, balanced kinetic damage, medium range (135px), steady fire rate.
   - **Pulse Laser (Rapid Turret):** 125 coins, high-frequency photon beam emitter (3.2 shots/s) specialized in eliminating swift scouts.
   - **Plasma Mortar (Heavy Battery):** 175 coins, long-range seismic mortar firing explosive shells with area-of-effect (AoE) splash damage.
   - Multi-tier upgrades (Rank 1 $\rightarrow$ Rank 2 $\rightarrow$ Rank 3) with damage, range, and fire rate multipliers.
   - Selectable targeting strategies: **First on Path**, **Closest**, **Lowest HP**, and **Strongest**.

4. **Multi-Class Hostile Invaders:**
   - **Cyber Infantry (Basic):** Balanced health (100 HP) and moderate velocity.
   - **Stealth Speeder (Fast):** Agile scout drone (92 px/s) attempting to rush past defenses.
   - **Goliath Mech (Strong):** Heavy armored siege juggernaut (320 HP, 20 base damage) requiring focused heavy firepower.

5. **Wave Progression & Difficulty Scaling:**
   - 10 structured enemy waves with progressive escalation.
   - Difficulty selection: **Cadet (Easy)**, **Commander (Medium)**, and **Veteran (Hard)** affecting starting coins, enemy health, and march velocities.

6. **In-Browser Procedural Sound Synthesis:**
   - Custom Web Audio API synthesizer generating retro-arcade SFX for firing, laser beams, mortar explosions, coin collection, wave alerts, game over, and victory fanfares without external audio file dependencies.

7. **Persistence & Academic Review Tools:**
   - Browser `localStorage` save & load state support.
   - Comprehensive test suite (TC01 to TC18) with a live in-browser execution runner.
   - Dedicated educational $A^*$ visualizer with step-by-step playback slider.

---

## 3. Technology Stack

- **Frontend Core:** React 19, TypeScript
- **Bundler & Tooling:** Vite 8
- **Rendering Engine:** HTML5 2D Canvas API (`requestAnimationFrame`)
- **Audio Engine:** HTML5 Web Audio API
- **Iconography:** Lucide React
- **Celebration FX:** Canvas Confetti
- **Testing Framework:** Vitest (Automated unit tests) + In-Browser Assertion Runner
- **Design System:** Tailored dark glassmorphic cyber-academic theme with responsive CSS

---

## 4. System Architecture

```
                            TOWER DEFENCE SYSTEM
                                     │
      ┌──────────────────────────────┼──────────────────────────────┐
      │                              │                              │
     GUI                         GAME LOGIC                     AI SYSTEM
      │                              │                              │
  Java Swing                    OOP Modules                  A* Pathfinding
 (Desktop App)                  ───────────                 (Manhattan Heuristic)
      │                     ┌────────┼────────┐                     │
  React Canvas              │        │        │               Enemy Navigation
  (Web Demo)              Towers  Enemies   Waves             Dynamic Recalculation
      │                     │        │        │
  User Input              Combat   Health  Progression
  (Mouse/Click)             │        │
                            └────────┴─── Economy / Coins
```

### Module Cross-Platform Mapping
| Subsystem | Original Java Swing Project | Web Demonstration Stack |
| :--- | :--- | :--- |
| **GUI Framework** | `JFrame`, `JPanel`, LayoutManagers | React 19 Functional Components |
| **Graphics** | `Graphics2D.paintComponent()` | HTML5 Canvas 2D Rendering Context |
| **Game Loop** | `javax.swing.Timer` / Background Worker | `requestAnimationFrame` Delta Loop |
| **Pathfinding** | `AStar.java` (PriorityQueue, Manhattan) | `AStar.ts` (Identical Algorithm & Costs) |
| **Entity OOP** | `Tower.java`, `Enemy.java`, `Projectile.java` | TypeScript ES6 Classes |
| **Audio** | `javax.sound.sampled.Clip` | Procedural Web Audio API Synthesizer |

---

## 5. Mathematical $A^*$ Formula & Algorithm

The $A^*$ pathfinding algorithm selects the next node $n$ to evaluate based on the minimum cost:

$$F(n) = G(n) + H(n)$$

Where:
- **$G(n)$** is the exact path cost from the starting node (Spawn Rift) to the current node $n$.
- **$H(n)$** is the admissible heuristic estimate from node $n$ to the goal (Base), computed via Manhattan distance:

$$H(n) = |x_n - x_{\text{target}}| + |y_n - y_{\text{target}}|$$

- **$F(n)$** is the total estimated path cost through node $n$.

### Algorithm Steps
1. Insert the starting node into the **Open Set** (priority queue).
2. Pop the node with the lowest $F(n)$ value.
3. If the popped node is the target (Base), reconstruct and return the optimal path via parent pointers.
4. Move the evaluated node to the **Closed Set**.
5. Traverse all 4 cardinal walkable neighbors (Up, Down, Left, Right).
6. If a neighbor is in the closed set or impassable (obstacle/tower), skip it.
7. If a neighbor is newly discovered or a cheaper $G(n)$ is found, update its costs and parent reference, then add it to the Open Set.
8. Repeat until the goal is reached or the Open Set is empty.

---

## 6. Installation & Local Development

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Setup Instructions
1. Clone or navigate to the repository directory:
   ```bash
   cd "c:/Users/venka/Downloads/CAPSTONE PROJECTS/java implementation"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the displayed local address (typically `http://localhost:5173`).

---

## 7. Testing & Verification

The project includes an automated test suite configured with **Vitest**:

```bash
npm test
```

### Test Coverage (TC01 – TC18)
- **$A^*$ Pathfinding:** Heuristic calculation, shortest path optimality, obstacle avoidance, unreachable goal handling, and snapshot step recording.
- **Economy & Resources:** Initial balances across difficulties, valid purchases, overdraft prevention, and reward credits.
- **Tower Defense Logic:** Placement validation on bastion zones vs. illegal placement on paths/crags, target acquisition priority, upgrade multipliers, and rank caps.
- **Wave System:** Queue scheduling, spawn intervals, wave completion bonuses, and Wave 10 victory trigger.

Additionally, navigate to the **Testing** tab in the web application to trigger the **Interactive In-Browser Test Suite** for live viva demonstrations.

---

## 8. Production Build

To compile and package the project for production deployment:

```bash
npm run build
```

To preview the compiled production distribution locally:

```bash
npm run preview
```

The optimized static bundle is emitted to the `/dist` directory and is ready for direct deployment to static hosts such as **GitHub Pages**, **Vercel**, or **Netlify**.

---

## 9. Game Controls

- **Left-Click (Board):** Select or place defensive towers.
- **Right-Click (Board):** Cancel active tower placement mode.
- **Start Wave Button:** Release the next wave of hostile creeps.
- **Pause / Resume:** Freeze or continue simulation.
- **Speed Multipliers (`0.5x`, `1x`, `2x`):** Adjust simulation tempo.
- **"SHOW $A^*$ PATH":** Toggle battlefield $A^*$ node inspection overlays.
- **Save / Load:** Persist operational deployment state to browser storage.

---

## 10. Future Scope

1. **Reinforcement Learning AI:** Transition from static heuristics to Deep Q-Networks (DQN) allowing creeps to adapt to defensive choke points.
2. **Procedural Cellular Automata Maps:** Infinite procedural terrain layouts with guaranteed path connectivity.
3. **Advanced Turret Arsenal:** Cryogenic stasis emitters, chain-lightning tesla coils, and anti-air flak emplacements.
4. **Mobile Deployment:** Native iOS and Android packaging using Capacitor with touch gestures and haptic feedback.

---

## 11. Academic Evaluation & Credits

- **Course:** CSA0913 – Programming in Java
- **Faculty Supervisor:** Dr. MADHUMITHA K
- **Project Team Members:**
  - G. Shiva Dhanasekhar (192311318)
  - G. Venu Gopal Reddy (192311303)
  - K. Omkar Eswar (192311431)
