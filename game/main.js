import { Keyboard } from "../engine/input/Keyboard.js";
import { TestScene } from "./TestScene.js";
const gameOverUI = document.getElementById("gameOverUI");
const backBtn = document.getElementById("backBtn");


const canvas = document.getElementById("gameCanvas");
const overlay = document.getElementById("ui-overlay");
const startBtn = document.getElementById("startBtn");
const fsLayer = document.getElementById("game-fullscreen-layer");
const ctx = canvas.getContext("2d");

Keyboard.init(); // Initialize keyboard input system

let lastTime = 0;
let isRunning = false;
let scene = null;
gameOverUI.hidden = true; 

startBtn.addEventListener("click", async () => {
  // 1️⃣ Read enemy count
  const enemySelect = document.getElementById("enemyCount");
  window.enemyCount = enemySelect ? Number(enemySelect.value) : 4;

  // 2️⃣ Fullscreen ONLY game layer
  if (fsLayer.requestFullscreen) {
    await fsLayer.requestFullscreen();   //use of asynchronous programming
  }

  // 3️⃣ Hide menu overlay
  overlay.style.display = "none";

  // 4️⃣ Create scene
  scene = new TestScene();
  isRunning = true;

  // 5️⃣ Focus canvas for keyboard
  canvas.focus();

  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
});

function gameLoop(time) {
  if (!isRunning) return;

  const dt = (time - lastTime) / 1000;
  lastTime = time;

  scene.update(dt);
  scene.render(ctx);

  // 🔴 GAME OVER CHECK
  if (scene.isGameOver()) {
    isRunning = false;
    gameOverUI.style.display = "flex";
    return;
  }

  requestAnimationFrame(gameLoop);
}
backBtn.addEventListener("click", async () => {
  // 1️⃣ Exit fullscreen
 gameOverUI.style.display = "none";
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  }

  // 2️⃣ Reset flags
  isRunning = false;
  scene = null;

  // 3️⃣ Hide game UI
  

  // 4️⃣ Show menu again
  overlay.style.display = "flex";
});
