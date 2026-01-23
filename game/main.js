import { Keyboard } from "../engine/input/Keyboard.js";
import { TestScene } from "./TestScene.js";
const gameOverUI = document.getElementById("gameOverUI");
const pauseUI = document.getElementById("pauseUI");
const backBtn = document.getElementById("backBtn");

const canvas = document.getElementById("gameCanvas");
const overlay = document.getElementById("ui-overlay");
const startBtn = document.getElementById("startBtn");
const fsLayer = document.getElementById("game-fullscreen-layer");
const ctx = canvas.getContext("2d");
const scoreValueEl = document.getElementById("scoreValue");
const scoreHUD = document.getElementById("scoreHUD");
const finalCard = document.getElementById("finalCard");
const finalCardValue = document.getElementById("finalCardValue");
const menuScoreValue = document.getElementById("menuScoreValue");
// ensure menu/outside score reflects persisted value on load
if (menuScoreValue)
  menuScoreValue.textContent = String(
    Number(localStorage.getItem("mr_score") || 0),
  );

// --- Inject Enemy Options ---
const enemySelectEl = document.getElementById("enemyCount");
if (enemySelectEl) {
  enemySelectEl.innerHTML = "";
  [8, 10, 15, 20].forEach((n) => {
    const opt = document.createElement("option");
    opt.value = n;
    opt.textContent = n + " Enemies";
    if (n === 10) opt.selected = true;
    enemySelectEl.appendChild(opt);
  });
}

// --- Hearts UI ---
const heartsContainer = document.createElement("div");
heartsContainer.className = "hearts-container";
heartsContainer.id = "heartsContainer";
if (fsLayer) fsLayer.appendChild(heartsContainer);
else document.body.appendChild(heartsContainer);

window.updateLives = function (current, max) {
  heartsContainer.innerHTML = "";
  for (let i = 0; i < max; i++) {
    const heart = document.createElement("div");
    heart.className = "heart" + (i < current ? "" : " lost");
    heartsContainer.appendChild(heart);
  }
};

// --- Inject Game Instructions ---
//game ui dom
const infoPanel = document.querySelector(".info");
if (infoPanel) {
  infoPanel.innerHTML = `
    <h2>CONTROLS</h2>
    <ul>
      <li><b>Move:</b> Arrows(><)/ W A S D</li>
      <li><b>Jump:</b> Up(^) / W</li>
      <li><b>Shoot:</b> Spacebar</li>
      <li><b>Pause:</b> P</li>
    </ul>
    <h2>RULES</h2>
    <ul>
      <li>Defeat all enemies to win!</li>
      <li>Touching an enemy on head kills you.</li>
      <li>Falling in lava kills you.</li>
      <li>You have 3 lives.</li>
    </ul>
  `;
}

// --- Intro Music ---
const bgMusic = new Audio("cottagecore-17463.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;
let musicUserEnabled = false; //by default closed 

const musicBtn = document.createElement("button");
musicBtn.id = "musicBtn";
musicBtn.textContent = "🔇 Music OFF";
if (overlay) overlay.appendChild(musicBtn);

musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicUserEnabled = true;
      musicBtn.textContent = "🔊 Music ON";
    }).catch((e) => console.warn(e));
  } else {
    bgMusic.pause();
    musicUserEnabled = false;
    musicBtn.textContent = "🔇 Music OFF";
  }
});

// --- Web Audio API for Low Latency SFX ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

class SynthSound {
  constructor(freq, duration, volume) {
    this.freq = freq;
    this.duration = duration;
    this.volume = volume;
  }
  cloneNode() {
    return new SynthSoundInstance(this.freq, this.duration, this.volume);
  }
}

class SynthSoundInstance {
  constructor(freq, duration, volume) {
    this.freq = freq;
    this.duration = duration;
    this.volume = volume;
    this.playbackRate = 1;
  }
  async play() {
    if (audioCtx.state === "suspended") await audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const f = this.freq * this.playbackRate;
    const d = this.duration / this.playbackRate;

    osc.frequency.value = f;
    osc.type = "sine";

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(this.volume, now);
    gain.gain.linearRampToValueAtTime(0.001, now + d);

    osc.start(now);
    osc.stop(now + d);
  }
}

function _makeAudioElement(id, freq, duration, volume) {
  return new SynthSound(freq, duration, volume);
}

// Create the main SFX elements
//Sound effcts added via Dom
window.sfxHit = _makeAudioElement("sfxHit", 250, 0.1, 0.8);
window.sfxKill = _makeAudioElement("sfxKill", 520, 0.18, 0.75);
window.sfxPoints = _makeAudioElement("sfxPoints", 1500, 0.2, 0.7);
window.sfxJump = _makeAudioElement("sfxJump", 900, 0.09, 0.6);
// Attack sound (Space) — distinct from jump
window.sfxAttack = _makeAudioElement("sfxAttack", 1300, 0.07, 0.7);
window.sfxPlayerDeath = _makeAudioElement("sfxPlayerDeath", 220, 0.6, 0.85);
// Game over sound (distinct, solemn chime)
window.sfxGameOver = _makeAudioElement("sfxGameOver", 330, 0.9, 0.85);
// Start/run sound (played when PLAY is clicked)
window.sfxStart = _makeAudioElement("sfxStart", 1800, 0.12, 0.75);
// Back to menu sound (distinct click)
window.sfxBack = _makeAudioElement("sfxBack", 600, 0.12, 0.7);
// Selection sound for character options
window.sfxSelect = _makeAudioElement("sfxSelect", 880, 0.1, 0.6);

// Initialize score from localStorage
let score = Number(localStorage.getItem("mr_score") || 0);
if (scoreValueEl) scoreValueEl.textContent = score;

window.addScore = function (points) {
  const prev = Number(score || 0);
  score = prev + Number(points);
  localStorage.setItem("mr_score", score);
  // update outside/menu score display as well
  try {
    if (menuScoreValue) menuScoreValue.textContent = String(score);
  } catch (e) {}
  if (scoreValueEl) {
    // Update displayed value and trigger a pulse animation
    // animate numeric change for a smoother feel
    animateNumber(scoreValueEl, prev, score, 360);
    if (scoreHUD) {
      scoreHUD.classList.add("pulse");
      scoreHUD.classList.add("shine");
      setTimeout(() => scoreHUD.classList.remove("pulse"), 220);
      setTimeout(() => scoreHUD.classList.remove("shine"), 520);

      // Floating +points popup
      const popup = document.createElement("div");
      popup.className = "score-popup";
      popup.textContent = ">+" + Number(points);
      scoreHUD.appendChild(popup);
      // Allow the browser to paint then show
      requestAnimationFrame(() => popup.classList.add("show"));
      setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
      }, 700);
    }
  }
  // Play points-added chime when points were given
  try {
    if (typeof window !== "undefined" && window.sfxPoints) {
      const p = window.sfxPoints.cloneNode();
      p.play().catch(() => {});
    }
  } catch (e) {}
};

// Smoothly animate a number from `from` to `to` in `el` over `duration` ms
function animateNumber(el, from, to, duration = 300) {
  if (!el) return;
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const v = Math.round(from + (to - from) * t);
    el.textContent = String(v);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Make the HUD clickable: allow manual reset of score
if (scoreHUD) {
  scoreHUD.addEventListener("click", (e) => {
    e.stopPropagation();
    try {
      if (confirm("Reset score to 0?")) {
        score = 0;
        localStorage.setItem("mr_score", 0);
        if (scoreValueEl) scoreValueEl.textContent = 0;
      }
    } catch (err) {
      /* ignore */
    }
  });
}

Keyboard.init(); // Initialize keyboard input system

let lastTime = 0;
let isRunning = false;
let isPaused = false;
let scene = null;
let gameOverHandled = false;
let autoRedirectTimer = null;
gameOverUI.hidden = true;

startBtn.addEventListener("click", async () => {
  bgMusic.pause();
  if (audioCtx.state === "suspended") await audioCtx.resume();
  // Play start sound immediately on the user gesture
  try {
    if (typeof window !== "undefined" && window.sfxStart) {
      const s = window.sfxStart.cloneNode();
      s.play().catch(() => {});
    }
  } catch (err) {}
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
  // 1️⃣ Read enemy count
  const enemySelect = document.getElementById("enemyCount");
  window.enemyCount = enemySelect ? Number(enemySelect.value) : 4;

  // Cleanup any existing player GIFs from previous runs
  document.querySelectorAll(".player-gif").forEach((el) => el.remove());

  // 2️⃣ Fullscreen ONLY game layer
  // 2️⃣ Hide menu overlay immediately so user sees game area
  overlay.style.display = "none";

  // Ensure UI overlays are inside the fullscreen element so they are visible
  if (fsLayer) {
    [gameOverUI, pauseUI, scoreHUD, finalCard, heartsContainer].forEach(
      (el) => {
        if (el && el.parentElement !== fsLayer) fsLayer.appendChild(el);
      },
    );
  }

  // 3️⃣ Try entering fullscreen for the game layer but continue if it fails
  try {
    if (fsLayer.requestFullscreen) await fsLayer.requestFullscreen();
  } catch (err) {
    // fullscreen may fail in some browsers or contexts; continue anyway
    console.warn("requestFullscreen failed:", err);
  }

  // ensure overlays are hidden
  gameOverUI.style.display = "none";
  gameOverUI.style.display = "none";
  pauseUI.style.display = "none";
  if (finalCard) finalCard.style.display = "none";
  if (scoreHUD) scoreHUD.style.display = "flex";
  if (heartsContainer) heartsContainer.style.display = "flex";
  window.updateLives(3, 3); // Reset lives
  gameOverHandled = false;

  // 4️⃣ Create scene
  // reset score at start of a new run
  score = 0;
  localStorage.setItem("mr_score", score);
  if (scoreValueEl) scoreValueEl.textContent = score;

  scene = new TestScene();
  isRunning = true;
  isPaused = false;

  // 5️⃣ Focus canvas for keyboard
  canvas.focus();

  lastTime = performance.now();
  // debug: log canvas and initial player position
  try {
    console.log("[DEBUG] canvas size:", canvas.width, canvas.height);
    if (scene && scene.player)
      console.log("[DEBUG] player start:", scene.player.x, scene.player.y);
  } catch (e) {}
  requestAnimationFrame(gameLoop);
});

function gameLoop(time) {
  if (!isRunning) return;

  const dt = (time - lastTime) / 1000;
  lastTime = time;

  // 🔧 PAUSE TOGGLE (P KEY)
  if (Keyboard.isDown("KeyP")) {
    isPaused = !isPaused;
    pauseUI.style.display = isPaused ? "flex" : "none";
    Keyboard.keys["KeyP"] = false; // Prevent repeated toggles
  }

  // Only update if not paused
  if (!isPaused) {
    scene.update(dt);
  }

  scene.render(ctx);

  // 🔴 GAME OVER CHECK (Handle only once)
  if (scene.isGameOver() && !gameOverHandled) {
    gameOverHandled = true;
    isRunning = false;

    // Update Game Over Text based on result
    const title = gameOverUI.querySelector("h1");
    const msg = gameOverUI.querySelector("p");
    if (scene.player && !scene.player.alive) {
      if (title) {
        title.textContent = "GAME OVER";
        title.style.color = "#ff4444";
      }
      if (msg) msg.textContent = "You died!";
    } else {
      if (title) {
        title.textContent = "VICTORY!";
        title.style.color = "#44ff44";
      }
      if (msg) msg.textContent = "You defeated all enemies!";
    }

    // Play game-over sound once
    try {
      if (typeof window !== "undefined" && window.sfxGameOver) {
        const g = window.sfxGameOver.cloneNode();
        g.play().catch(() => {});
      }
    } catch (err) {}
    // Show final score in the overlay
    try {
      const finalEl = document.getElementById("finalScore");
      if (finalEl) finalEl.textContent = Number(score || 0);
    } catch (e) {}

    // also update the top-left final card if present
    try {
      if (finalCard && finalCardValue) {
        finalCardValue.textContent = Number(score || 0);
        finalCard.style.display = "flex";
        // animate briefly
        finalCard.classList.remove("pop");
        requestAnimationFrame(() => finalCard.classList.add("pop"));
      }
    } catch (e) {}

    gameOverUI.style.display = "flex";
    pauseUI.style.display = "none";

    // Auto redirect to home after 10 seconds
    if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
    autoRedirectTimer = setTimeout(() => {
      if (backBtn) backBtn.click();
    }, 10000);
    return;
  }

  requestAnimationFrame(gameLoop);
}
backBtn.addEventListener("click", async () => {
  if (musicUserEnabled) {
    bgMusic.play().catch(() => {});
  }
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
  // play a distinct back-to-menu sound on click
  try {
    if (typeof window !== "undefined" && window.sfxBack) {
      const b = window.sfxBack.cloneNode();
      b.play().catch(() => {});
    }
  } catch (err) {}

  // Cleanup player GIFs
  document.querySelectorAll(".player-gif").forEach((el) => el.remove());

  // 1️⃣ Exit fullscreen
  gameOverUI.style.display = "none";
  if (finalCard) finalCard.style.display = "none";
  if (heartsContainer) heartsContainer.style.display = "none";
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  }

  // 2️⃣ Reset flags
  isRunning = false;
  isPaused = false;
  scene = null;
  gameOverHandled = false;

  // 3️⃣ Show menu again
  overlay.style.display = "flex";
});

// Reload the page when leaving fullscreen so the scorecard resets to default
// This ensures that if the user presses ESC to exit fullscreen, the HUD and
// localStorage-backed score are reset to the menu state.
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
    // Only reload when a run is active; otherwise just clear the last score
    if (isRunning) {
      try {
        window.location.reload();
      } catch (e) {
        localStorage.setItem("mr_score", 0);
        if (scoreValueEl) scoreValueEl.textContent = 0;
        overlay.style.display = "flex";
      }
    } else {
      // Not running: clear score and show menu
      localStorage.setItem("mr_score", 0);
      if (scoreValueEl) scoreValueEl.textContent = 0;
      overlay.style.display = "flex";
    }
  }
});
