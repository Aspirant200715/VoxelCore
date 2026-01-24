Somario- Web Dev End Term Project

A custom 2D game engine and platformer game built from scratch using vanilla JavaScript, HTML5 Canvas, and CSS3. This project demonstrates a modular Entity-Component-System (ECS) architecture, custom physics, and state management without relying on external game libraries.

**Technical Highlight:** Since Object-Oriented Programming (OOP) is important for JavaScript, this project has used **OOP** along with **DOM manipulation** and **Asynchronous JavaScript**.

## 🎮 Project Overview

- **Project Type:** Web Development End Term Project
- **Engine Name:** Somario
- **Game Title:** Run Mario Run
- **Tech Stack:** HTML5, CSS3, JavaScript (ES6 Modules)

## 🚀 Features

- **Custom ECS Engine:** Built on a modular Entity-Component-System architecture for scalable game logic.
- **Physics & Collision:** Custom AABB (Axis-Aligned Bounding Box) collision detection and resolution.
- **Game Loop:** Optimized `requestAnimationFrame` loop handling logic updates and rendering separately.
- **Audio System:** Web Audio API integration for synthesized SFX and background music.
- **Dynamic UI:** Responsive menus, HUD, and game-over screens using HTML/CSS overlays interacting with the Canvas. 30-40% usage of DOM.
- **Level Generation:** Procedural-style placement of platforms, lava, and enemies.

## 📂 Modular File Structure

The project is structured to separate the core engine logic from the specific game implementation using ES6 Modules.

### 1. Core Engine (`/engine`)

These files constitute the reusable game engine logic, decoupled from specific game content.

- **`engine/ecs/Entity.js`**:
  - The fundamental base class for all objects in the game (Player, Enemy, Platforms).
  - Manages core properties: `x`, `y` coordinates, `width`, `height`, and state flags like `alive` and `solid`.
  - Provides empty `update(dt)` and `render(ctx)` methods to be overridden by subclasses.

- **`engine/ecs/systems/`**:
  - **`MovementSystem.js`**: Handles the physics simulation. It applies gravity, velocity, and resolves collisions between dynamic entities (like the Player) and static environment blocks (Bricks).
  - **`CollisionSystem.js`**: Optimization layer that detects overlaps. It provides helper methods to find all colliding pairs in the current frame.
  - **`CombatSystem.js`**: Encapsulates game rules for combat.
    - Checks collisions between Bullets and Enemies.
    - Handles Player melee attacks using hitboxes (`attackBox`).
    - Manages damage application, entity death states, and triggers score/SFX events.

- **`engine/physics/Collision.js`**:
  - Contains pure mathematical functions for collision detection.
  - Exports `aabb(a, b)`: Performs Axis-Aligned Bounding Box checks to determine if two rectangles intersect.

- **`engine/input/Keyboard.js`**:
  - A static class managing user input.
  - Listens for `keydown` and `keyup` events globally.
  - Stores the state of keys in a dictionary (`keys`) for efficient polling via `Keyboard.isDown(code)`.

### 2. Game Implementation (`/game`)

These files utilize the engine to build "Run Mario Run".

- **`game/main.js`**:
  - **Entry Point**: Bootstraps the application.
  - **UI Management**: Handles DOM overlays for the Start Screen, HUD (Score, Lives), Pause Menu, and Game Over screens.
  - **Audio**: Initializes the Web Audio API context and manages background music/SFX.
  - **Game Loop**: Runs the `requestAnimationFrame` loop, calculating delta time (`dt`) and delegating updates to the active Scene.

- **`game/TestScene.js`**:
  - Represents the main level of the game.
  - **World Generation**: Procedurally places `Brick` platforms, `Lava` pits, and decorative elements (`Cloud`, `Grass`, `Bird`).
  - **Entity Spawning**: Instantiates the `Player` and places `Enemy` units based on selected difficulty.
  - **Camera Logic**: Implements a side-scrolling camera that follows the player's X position.
  - **Game Logic**: Checks for win/loss conditions (lives < 0, falling in lava, killing all enemies).

- **`game/entities/`**:
  - **`Player.js`**: The hero character. Contains logic for movement physics (jump, run), animation state switching, and input handling.
  - **`Enemy.js`**: AI-controlled opponents. Implements simple patrolling behavior and interaction logic.
  - **`Bullet.js`**: Projectiles fired by the player.

### 3. Web Interface

- **`index.html`**: The main container. It loads the modules and provides the DOM structure for the Canvas and UI overlays.
- **`style.css`**: Handles the visual styling of the menus, HUD, and responsive layout adjustments.

## 🛠️ How to Run Locally

Because this project uses **ES6 Modules** (`import`/`export`), browsers will block execution if you simply open the `index.html` file directly due to CORS (Cross-Origin Resource Sharing) policies. You must serve the files via a local web server.

### Option 1: VS Code Live Server (Recommended)

1.  Open the project folder in **Visual Studio Code**.
2.  Install the **Live Server** extension .
3.  Right-click on `index.html` in the file explorer.
4.  Select **"Open with Live Server"**.

### Option 2: Python

If you have Python installed, you can run a simple HTTP server from the terminal:

1.  Open a terminal/command prompt in the project root folder.
2.  Run the following command:
    ```bash
    # For Python 3
    python -m http.server 8000
    ```
3.  Open your browser and go to `http://localhost:8000`.

### Option 3: Node.js

If you have Node.js installed:

1.  Run `npx http-server .` in the terminal.
2.  Open the URL shown in the terminal.

## 🕹️ How to Play

### Controls

- **Arrow Keys / WASD**: Move Left/Right
- **Up Arrow / W**: Jump
- **Space**: Attack / Shoot Projectile
- **P**: Pause Game
- **Esc**: Exit to Main Menu

### Rules & Objective

1.  **Objective**: The goal is to defeat all enemies on the map to win the level.
2.  **Combat**: You must use your attack (Spacebar) to defeat enemies. Simply touching them will cause you to lose a life.
3.  **Hazards**: Avoid falling into the lava pits.
4.  **Lives**: You start with 3 lives. If you lose all of them, it's Game Over.

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the engine or add new features:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature (`git checkout -b feature/AmazingFeature`).
3.  **Commit your changes** (`git commit -m 'Add some AmazingFeature'`).
4.  **Push to the branch** (`git push origin feature/AmazingFeature`).
5.  **Open a Pull Request**.
