import { TestScene } from "./game/TestScene.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let lastTime = 0;
const scene = new TestScene();

function gameLoop(time) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  scene.update(dt);
  scene.render(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
