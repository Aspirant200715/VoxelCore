import { Keyboard } from "../engine/input/Keyboard.js";
import { TestScene } from "./TestScene.js";

const gameOverUI = document.getElementById("gameOverUI");
const pauseUI = document.getElementById("pauseUI");
const backBtn = document.getElementById("backBtn");
const canvas = document.getElementById("gameCanvas");
const overlay = document.getElementById("ui-overlay");
const startBtn = document.getElementById("startBtn");
const fsLayer = document.getElementById("game-fullscreen-layer");
const gameWrapper = document.querySelector(".game-wrapper");
const ctx = canvas.getContext("2d");
const scoreValueEl = document.getElementById("scoreValue");
const scoreHUD = document.getElementById("scoreHUD");
const killsValueEl = document.getElementById("killsValue");
const killsHUD = document.getElementById("killsHUD");
const finalCard = document.getElementById("finalCard");
const finalCardValue = document.getElementById("finalCardValue");
const menuScoreValue = document.getElementById("menuScoreValue");


if (menuScoreValue){
  menuScoreValue.textContent = String(
    Number(localStorage.getItem("mr_score") || 0),
  );
}

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



const heartsContainer = document.createElement("div");
heartsContainer.className = "hearts-container";
heartsContainer.id = "heartsContainer";
if (gameWrapper) gameWrapper.appendChild(heartsContainer);
else document.body.appendChild(heartsContainer);

window.updateLives = function (current, max) {
  heartsContainer.innerHTML = "";
  for (let i = 0; i < max; i++) {
    const heart = document.createElement("div");
    heart.className = "heart" + (i < current ? "" : " lost");
    heartsContainer.appendChild(heart);
  }
};


const infoPanel = document.querySelector(".info");
if (infoPanel) {
  infoPanel.innerHTML = `
    <h2>CONTROLS</h2>
    <ul>
      <li><b>Move:</b> Arrows(><)/ W A S D</li>
      <li><b>Jump:</b> Up(^) / W</li>
      <li><b>Shoot:</b> Spacebar</li>
      <li><b>Pause:</b> P</li>
      <li><b>Esc:</b> Leave</li>
    </ul>
    <h2>RULES</h2>
    <ul>
      <li>Defeat all enemies to win!</li>
      <li>Touching an enemy on head kills you.</li>
      <li>Falling in lava kills you.</li>
      <li>You have 3 lives.</li>
      <li>Coming in between 2 enemies kills you.</li>
    </ul>
  `;
}


const bgMusic = new Audio("cottagecore-17463.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;
bgMusic.preload = "auto";
let musicUserEnabled = false;

const musicBtn = document.createElement("button");
musicBtn.id = "musicBtn";
musicBtn.textContent = "🔇 Music OFF";
if (overlay) overlay.appendChild(musicBtn);

musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic
      .play()
      .then(() => {
        musicUserEnabled = true;
        musicBtn.textContent = "🔊 Music ON";
      })
      .catch((e) => console.warn(e));
  } else {
    bgMusic.pause();
    musicUserEnabled = false;
    musicBtn.textContent = "🔇 Music OFF";
  }
});

//Webkit Api
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const resumeAudio = () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch((e) => console.warn(e));
  }
};
window.addEventListener("click", resumeAudio, { once: true });
window.addEventListener("keydown", resumeAudio, { once: true });
window.addEventListener("touchstart", resumeAudio, { once: true });

if (overlay) overlay.style.display = "none";

const splash = document.createElement("div");
splash.style.position = "fixed";
splash.style.inset = "0";
splash.style.background = "linear-gradient(135deg, #767571 0%, #033c08 100%)";
splash.style.display = "flex";
splash.style.flexDirection = "column";
splash.style.justifyContent = "center";
splash.style.alignItems = "center";
splash.style.zIndex = "100000";
splash.style.color = "#fff";
splash.style.fontFamily = "'VT323', monospace";

const splashTitle = document.createElement("h1");
splashTitle.textContent = "Game Set Go";
splashTitle.style.fontSize = "clamp(70px, 30vw, 220px)";
splashTitle.style.marginBottom = "20px";
splashTitle.style.textTransform = "uppercase";
splashTitle.style.textShadow = "6px 6px 0 #000";
splashTitle.style.animation = "bounce 0.6s infinite alternate";

const splashText = document.createElement("p");
splashText.textContent = "Press ENTER to Start";
splashText.style.fontSize = "clamp(24px, 4vw, 60px)";
splashText.style.textShadow = "2px 2px 0 #000";
splashText.style.animation = "blink 1s infinite";

const splashStyle = document.createElement("style");
splashStyle.textContent = `
@keyframes blink { 50% { opacity: 0; } }
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-15px); } }
`;


document.head.appendChild(splashStyle);
splash.appendChild(splashTitle);
splash.appendChild(splashText);
document.body.appendChild(splash);

const handleSplashEnter = async (e) => {
  if (e.key === "Enter") {
    window.removeEventListener("keydown", handleSplashEnter);
    splash.style.transition = "opacity 0.5s ease";
    splash.style.opacity = "0";
    setTimeout(() => splash.remove(), 500);


    if (overlay) overlay.style.display = "flex";
    try {
      await bgMusic.play();
      musicUserEnabled = true;
      if (musicBtn) musicBtn.textContent = "🔊 Music ON";
    } catch (err) {
      console.warn("Auto-play blocked:", err);
    }
    
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch((e) => console.warn(e));
    }
  }
};
window.addEventListener("keydown", handleSplashEnter);



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

//Game sounds Sfxhit- one sound different frequencies 
window.sfxHit = _makeAudioElement("sfxHit", 250, 0.1, 0.8);
window.sfxKill = _makeAudioElement("sfxKill", 520, 0.18, 0.75);
window.sfxPoints = _makeAudioElement("sfxPoints", 1500, 0.2, 0.7);
window.sfxJump = _makeAudioElement("sfxJump", 900, 0.09, 0.6);
window.sfxAttack = _makeAudioElement("sfxAttack", 1300, 0.07, 0.7);
window.sfxPlayerDeath = _makeAudioElement("sfxPlayerDeath", 220, 0.6, 0.85);
window.sfxGameOver = _makeAudioElement("sfxGameOver", 330, 0.9, 0.85);
window.sfxStart = _makeAudioElement("sfxStart", 1800, 0.12, 0.75);
window.sfxBack = _makeAudioElement("sfxBack", 600, 0.12, 0.7);
window.sfxSelect = _makeAudioElement("sfxSelect", 880, 0.1, 0.6);

let score = Number(localStorage.getItem("mr_score") || 0);
if (scoreValueEl) scoreValueEl.textContent = score;

let kills = 0;

window.addKill = function (count = 1) {
  kills += count;
  if (killsValueEl) {
    killsValueEl.textContent = kills;
    if (killsHUD) killsHUD.classList.add("pulse");
    setTimeout(() => killsHUD && killsHUD.classList.remove("pulse"), 220);
  }
};

//Final Score 
window.addScore = function (points) {
  const prev = Number(score || 0);
  score = prev + Number(points);
  localStorage.setItem("mr_score", score);
  try {
    if (menuScoreValue) menuScoreValue.textContent = String(score);
  } catch (e) {}
  if (scoreValueEl) {
    animateNumber(scoreValueEl, prev, score, 360);
    if (scoreHUD) {
      scoreHUD.classList.add("pulse");
      scoreHUD.classList.add("shine");
      setTimeout(() => scoreHUD.classList.remove("pulse"), 220);
      setTimeout(() => scoreHUD.classList.remove("shine"), 520);

      const popup = document.createElement("div");
      popup.className = "score-popup";
      popup.textContent = ">+" + Number(points);
      scoreHUD.appendChild(popup);
      requestAnimationFrame(() => popup.classList.add("show"));
      setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
      }, 700);
    }
  }
  try {
    if (typeof window !== "undefined" && window.sfxPoints) {
      const p = window.sfxPoints.cloneNode();
      p.play().catch(() => {});
    }
  } catch (e) {}
};

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
      
    }
  });
}

Keyboard.init();

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
  try {
    if (typeof window !== "undefined" && window.sfxStart) {
      const s = window.sfxStart.cloneNode();
      s.play().catch(() => {});
    }
  } catch (err) {}
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
  const enemySelect = document.getElementById("enemyCount");
  window.enemyCount = enemySelect ? Number(enemySelect.value) : 4;

  document.querySelectorAll(".player-gif").forEach((el) => el.remove());

  overlay.style.display = "none";

  if (fsLayer && gameWrapper) {
    [gameOverUI, pauseUI, finalCard].forEach(
      (el) => {
        if (el && el.parentElement !== fsLayer) fsLayer.appendChild(el);
      },
    );
    if (scoreHUD && scoreHUD.parentElement !== gameWrapper) gameWrapper.appendChild(scoreHUD);
    if (killsHUD && killsHUD.parentElement !== gameWrapper) gameWrapper.appendChild(killsHUD);
    if (heartsContainer && heartsContainer.parentElement !== gameWrapper) gameWrapper.appendChild(heartsContainer);
  }

  try {
    if (fsLayer.requestFullscreen) await fsLayer.requestFullscreen();
  } catch (err) {
    console.warn("requestFullscreen failed:", err);
  }

  // ensure overlays are hidden
  gameOverUI.style.display = "none";
  gameOverUI.style.display = "none";
  pauseUI.style.display = "none";
  if (finalCard) finalCard.style.display = "none";
  if (scoreHUD) scoreHUD.style.display = "flex";
  if (killsHUD) killsHUD.style.display = "flex";
  if (heartsContainer) heartsContainer.style.display = "flex";
  window.updateLives(3, 3);
  gameOverHandled = false;

  score = 0;
  localStorage.setItem("mr_score", score);
  if (scoreValueEl) scoreValueEl.textContent = score;
  kills = 0;
  if (killsValueEl) killsValueEl.textContent = kills;

  scene = new TestScene();
  isRunning = true;
  isPaused = false;

  canvas.focus();
//important test 
  lastTime = performance.now();
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

  if (Keyboard.isDown("KeyP")) {
    isPaused = !isPaused;
    pauseUI.style.display = isPaused ? "flex" : "none";
    Keyboard.keys["KeyP"] = false;
  }

  if (!isPaused) {
    scene.update(dt);
  }

  scene.render(ctx);

  if (scene.isGameOver() && !gameOverHandled) {
    gameOverHandled = true;
    isRunning = false;

    const title = gameOverUI.querySelector("h1");
    const msg = gameOverUI.querySelector("p");
    const finalScoreText = `<br><span style="font-size: 0.8em; color: #ffd966">Final Score: ${Number(score || 0)}</span>`;
    if (scene.player && !scene.player.alive) {
      if (title) {
        title.textContent = "GAME OVER";
        title.style.color = "#ff4444";
      }
      if (msg) msg.innerHTML = "You died!" + finalScoreText;
    } else {
      if (title) {
        title.textContent = "VICTORY!";
        title.style.color = "#44ff44";
      }
      if (msg) msg.innerHTML = "You defeated all enemies!" + finalScoreText;
    }

    try {
      if (typeof window !== "undefined" && window.sfxGameOver) {
        const g = window.sfxGameOver.cloneNode();
        g.play().catch(() => {});
      }
    } catch (err) {}
    try {
      const finalEl = document.getElementById("finalScore");
      if (finalEl) finalEl.textContent = Number(score || 0);
    } catch (e) {}

    try {
      if (finalCard && finalCardValue) {
        finalCardValue.textContent = Number(score || 0);
        finalCard.style.display = "flex";
        finalCard.classList.remove("pop");
        requestAnimationFrame(() => finalCard.classList.add("pop"));
      }
    } catch (e) {}

    gameOverUI.style.display = "flex";
    pauseUI.style.display = "none";

    if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
    autoRedirectTimer = setTimeout(() => {
      if (backBtn) backBtn.click();
    }, 10000);
    return;
  }

  requestAnimationFrame(gameLoop); //requests the game to start over again
}
backBtn.addEventListener("click", async () => {
  if (musicUserEnabled) {
    bgMusic.play().catch(() => {});
  }
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
  try {
    if (typeof window !== "undefined" && window.sfxBack) {
      const b = window.sfxBack.cloneNode();
      b.play().catch(() => {});
    }
  } catch (err) {}

  document.querySelectorAll(".player-gif").forEach((el) => el.remove());

  gameOverUI.style.display = "none";
  if (finalCard) finalCard.style.display = "none";
  if (heartsContainer) heartsContainer.style.display = "none";
  if (killsHUD) killsHUD.style.display = "none";
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  }

  isRunning = false;
  isPaused = false;
  scene = null;
  gameOverHandled = false;

  overlay.style.display = "flex";
});

//full screen change redirects to mario screen 
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    if (autoRedirectTimer) clearTimeout(autoRedirectTimer);
    if (isRunning) {
      try {
        window.location.reload();
      } catch (e) {
        localStorage.setItem("mr_score", 0);
        if (scoreValueEl) scoreValueEl.textContent = 0;
        overlay.style.display = "flex";
      }
    } else {
      localStorage.setItem("mr_score", 0);
      if (scoreValueEl) scoreValueEl.textContent = 0;
      overlay.style.display = "flex";
    }
  }
});
