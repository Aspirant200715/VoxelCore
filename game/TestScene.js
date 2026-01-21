import { Scene } from "../engine/core/Scene.js";
import { World } from "../engine/ecs/World.js";
import { Player } from "./entities/Player.js";
import { Enemy } from "./entities/Enemy.js";
import { Entity } from "../engine/ecs/Entity.js";
import { MovementSystem } from "../engine/ecs/systems/MovementSystem.js";
import { CollisionSystem } from "../engine/ecs/systems/CollisionSystem.js";
import { CombatSystem } from "../engine/ecs/systems/CombatSystem.js";
class Brick extends Entity {
  constructor(x, y, w = 40, h = 40) {
    super(x, y, w, h);
    this.solid = true;
  }
  render(ctx) {
    ctx.fillStyle = "#8b4513"; // Brown brick color
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#bc5b11";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}
class Cloud extends Entity {
  constructor(x, y, speed) {
    super(x, y, 80, 40);
    this.speed = speed;
    this.tag = "decoration";
    this.solid = false;
  }

  update(dt) {
    this.x += this.speed * dt;

    if (this.x > 960) {
      this.x = -this.width;
      this.y = Math.random() * 150;
    }
  }

  render(ctx) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(this.x + 20, this.y + 20, 20, 0, Math.PI * 2);
    ctx.arc(this.x + 40, this.y + 15, 25, 0, Math.PI * 2);
    ctx.arc(this.x + 60, this.y + 20, 20, 0, Math.PI * 2);
    ctx.fill();
  }
}
export class TestScene extends Scene {
  constructor() {
    super();
    this.world = new World();
    this.gameOver = false;
    this.gameStarted = false;
    this.world.add(new Cloud(100, 50, 20));
    this.world.add(new Cloud(400, 80, 15));
    this.world.add(new Cloud(700, 40, 25));
    this.player = new Player(50, 200, window.selectedHero);
    this.world.add(this.player);
    this.levelWidth = 3000;
    this.levelEndX = this.levelWidth - 200;

    for (let i = 0; i < this.levelWidth / 40; i++) {
      this.world.add(new Brick(i * 40, 360));
    }


    // Fixed Y lanes (DO NOT GUESS VALUES)
    //Position of each and every block and brick
    const GROUND_Y = 360;
    const LOW = 300;
    const MID = 240;
    const HIGH = 180;

    this.world.add(new Brick(400, LOW, 120, 30));
    this.world.add(new Brick(600, LOW, 120, 30));

    this.world.add(new Brick(850, MID, 120, 30));
    this.world.add(new Brick(1050, HIGH, 120, 30));

    this.world.add(new Brick(1350, MID, 120, 30));
    this.world.add(new Brick(1600, LOW, 120, 30));

    this.world.add(new Brick(1900, MID, 120, 30));
    this.world.add(new Brick(2200, HIGH, 120, 30));

    this.world.add(new Enemy(420, LOW - 40));
    this.world.add(new Enemy(880, MID - 40));
    this.world.add(new Enemy(1080, HIGH - 40));
    this.world.add(new Enemy(1620, LOW - 40));

    this.world.add(new Enemy(2250, HIGH - 40));
  }
  isGameOver() {
  return this.gameOver;
}

  update(dt) {

    if (!this.gameStarted) {
  this.gameStarted = true;
  return; // skip first frame checks
}
    if (this.gameOver) {
  this.player.speed = 0;
  return;
}
    this.player.isGrounded = false;
    this.world.update(dt, this.player);
    const entities = this.world.entities;
    const pairs = CollisionSystem.getPairs(entities);
    for (const [a, b] of pairs) {
      MovementSystem.resolvePlayerCollision(this.player, a, b);
    }
    const attackBox = this.player.isAttacking
      ? {
          x:
            this.player.facing === 1
              ? this.player.x + this.player.width
              : this.player.x - 40,
          y: this.player.y + 5,
          width: 40,
          height: this.player.height - 10,
        }
      : null;

    CombatSystem.handle(this.player, this.world.entities, attackBox);
    CombatSystem.resetHitLocks(this.player, this.world.entities);

const enemiesLeft = this.world.entities.filter(
  (e) => e.tag === "enemy"
);

if (enemiesLeft.length === 0) {
  console.log("NO ENEMIES LEFT → GAME OVER");
  this.gameOver = true;
}

    
  }

  render(ctx) {
    ctx.fillStyle = "#74992a"; //game background design
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();

    // Camera follows player
    const camX = Math.max(0, this.player.x - ctx.canvas.width / 2);
    ctx.translate(-camX, 0);

    this.world.render(ctx);

    ctx.restore();

    if (this.gameOver) {
      this.drawEndScreen(ctx);
    }
  }

  drawEndScreen(ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, 800, 400);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 70px sans-serif";
    ctx.fillText("GAME OVER!", 400, 200);
  }
}
