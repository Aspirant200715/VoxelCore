import { Scene } from "../engine/core/Scene.js";
import { World } from "../engine/ecs/World.js";
import { Player } from "./entities/Player.js";
import { Enemy } from "./entities/Enemy.js";
import { Bullet } from "./entities/Bullet.js";
import { Entity } from "../engine/ecs/Entity.js";
import { MovementSystem } from "../engine/ecs/systems/MovementSystem.js";
import { CollisionSystem } from "../engine/ecs/systems/CollisionSystem.js";
import { CombatSystem } from "../engine/ecs/systems/CombatSystem.js";
class Brick extends Entity {
  constructor(x, y, w = 60, h = 60) {
    super(x, y, w, h);
    this.solid = true;
  }
  render(ctx) {
    ctx.fillStyle = "#795548";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(this.x, this.y, this.width, 18);

    ctx.fillRect(this.x + 6, this.y + 18, 6, 6);
    ctx.fillRect(this.x + 24, this.y + 18, 6, 9);
    ctx.fillRect(this.x + 42, this.y + 18, 6, 5);

    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(this.x + 12, this.y + 36, 6, 6);
    ctx.fillRect(this.x + 36, this.y + 48, 6, 6);
  }
}

class Lava extends Entity {
  constructor(x, y) {
    super(x, y, 60, 600);
    this.solid = false;
    this.bubbleTimer = Math.random() * 100;
  }
  update(dt) {
    this.bubbleTimer += dt;
  }
  render(ctx) {
    ctx.fillStyle = "#cf1020";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#ff4500";
    const y1 = Math.sin(this.bubbleTimer * 3) * 6;
    const y2 = Math.cos(this.bubbleTimer * 4) * 6;
    ctx.fillRect(this.x + 5, this.y + 10 + y1, 10, 10);
    ctx.fillRect(this.x + 25, this.y + 30 + y2, 8, 8);
  }
}

class Cloud extends Entity {
  constructor(x, y, speed, worldWidth) {
    super(x, y, 80, 40);
    this.speed = speed;
    this.tag = "decoration";
    this.solid = false;
    this.startX = x;
    this.worldWidth = worldWidth || null;
  }

  update(dt) {
    this.x += this.speed * dt;

    const canvasEl =
      typeof document !== "undefined"
        ? document.getElementById("gameCanvas")
        : null;
    const canvasW = canvasEl ? canvasEl.width : 2000;
    const wrapW = this.worldWidth || canvasW || 2000;
    if (this.x > wrapW + this.width) {
      this.x = -this.width;
    } else if (this.x < -this.width) {
      this.x = wrapW + this.width;
    }
  }

  render(ctx) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(this.x, this.y, 80, 24);
    ctx.fillRect(this.x + 16, this.y - 16, 48, 16);
  }
}

class Bird extends Entity {
  constructor(x, y, speed, worldWidth) {
    super(x, y, 28, 14);
    this.speed = speed;
    this.tag = "decoration";
    this.solid = false;
    this.wingTimer = 0;
    this.worldWidth = worldWidth || null;
  }

  update(dt) {
    this.x += this.speed * dt;
    const canvasEl =
      typeof document !== "undefined"
        ? document.getElementById("gameCanvas")
        : null;
    const canvasW = canvasEl ? canvasEl.width : 2000;
    const wrapW = this.worldWidth || canvasW || 2000;
    if (this.speed > 0) {
      if (this.x > wrapW + this.width) this.x = -this.width;
    } else {
      if (this.x < -this.width) this.x = wrapW + this.width;
    }
    this.wingTimer += dt * 12;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    const flap = Math.sin(this.wingTimer) * 6;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.quadraticCurveTo(8, 8 - flap, 18, 6);
    ctx.moveTo(0, 6);
    ctx.quadraticCurveTo(8, 6 + flap, 18, 6);
    ctx.stroke();
    ctx.restore();
  }
}

class Grass extends Entity {
  constructor(x, y) {
    super(x, y, 12, 18);
    this.tag = "decoration";
    this.solid = false;
  }

  render(ctx) {
    ctx.fillStyle = "#388E3C";
    ctx.fillRect(this.x + 2, this.y + 8, 4, 10);
    ctx.fillRect(this.x + 8, this.y + 4, 4, 14);
  }
}
export class TestScene extends Scene {
  constructor() {
    super();
    this.world = new World();
    this.gameOver = false;
    this.gameStarted = false;
    this.deathTimer = 0;
    this.waitingForDeath = false;
    this.lives = 3;
    this.levelWidth = 12000;
    this.levelEndX = this.levelWidth - 200;
    //clouds
    this.world.add(new Cloud(100, 50, 20, this.levelWidth));
    this.world.add(new Cloud(400, 80, 15, this.levelWidth));
    this.world.add(new Cloud(700, 40, 25, this.levelWidth));
    this.world.add(new Cloud(1100, 60, 18, this.levelWidth));
    this.world.add(new Cloud(1500, 90, 22, this.levelWidth));
    this.world.add(new Cloud(1900, 50, 16, this.levelWidth));
    this.world.add(new Cloud(2300, 70, 20, this.levelWidth));

    this.startX = 100;
    this.startY = 440;
    this.player = new Player(this.startX, this.startY, window.selectedHero);
    this.world.add(this.player);

    for (let i = 0; i < this.levelWidth / 60; i++) {
      if (i > 15 && i % 25 > 18) {
        this.world.add(new Lava(i * 60, 670));
        continue;
      }
      this.world.add(new Brick(i * 60, 600));
      this.world.add(new Lava(i * 60, 670));
    }

    this.world.add(new Brick(2790, 600));

    const GROUND_Y = 600;
    const LOW = 560;
    const MID = 510;
    const HIGH = 460;

    this.world.add(new Brick(400, LOW, 120, 30));
    this.world.add(new Brick(600, LOW, 120, 30));

    this.world.add(new Brick(850, MID, 120, 30));
    this.world.add(new Brick(1050, HIGH, 120, 30));

    this.world.add(new Brick(1350, MID, 120, 30));
    this.world.add(new Brick(1600, LOW, 120, 30));

    this.world.add(new Brick(1900, MID, 120, 30));
    this.world.add(new Brick(2200, HIGH, 120, 30));

    for (let x = 3000; x < this.levelWidth - 500; x += 800) {
      this.world.add(new Brick(x, LOW, 120, 30));
      this.world.add(new Brick(x + 200, MID, 120, 30));
      this.world.add(new Brick(x + 400, HIGH, 120, 30));
      this.world.add(new Brick(x + 600, MID, 120, 30));
    }
    //enemy position handling
    const enemyCount = window.enemyCount || 4;
    const enemyPositions = [
      { x: 420, y: LOW - 40 },
      { x: 880, y: MID - 40 },
      { x: 1080, y: HIGH - 40 },
      { x: 1620, y: LOW - 40 },
      { x: 2250, y: HIGH - 40 },
      { x: 500, y: LOW - 40 },
      { x: 950, y: MID - 40 },
      { x: 1350, y: LOW - 40 },
    ];

    for (let x = 3000; x < this.levelWidth - 500; x += 800) {
      enemyPositions.push({ x: x + 20, y: LOW - 40 });
      enemyPositions.push({ x: x + 420, y: HIGH - 40 });
    }

    for (let i = 0; i < Math.min(enemyCount, enemyPositions.length); i++) {
      const pos = enemyPositions[i];
      this.world.add(new Enemy(pos.x, pos.y));
    }

    for (let gx = 0; gx < this.levelWidth; gx += 54) {
      this.world.add(new Grass(gx + 4, GROUND_Y - 18));
    }

    const birdY = [60, 90, 120, 50, 140];
    for (let i = 0; i < 6; i++) {
      const bx = Math.random() * this.levelWidth;
      const by = birdY[i % birdY.length] + Math.random() * 30 - 10;
      const speed = (Math.random() * 80 + 40) * (Math.random() > 0.5 ? 1 : -1);
      this.world.add(new Bird(bx, by, speed, this.levelWidth));
    }
  }
  isGameOver() {
    return this.gameOver;
  }

  update(dt) {
    if (!this.gameStarted) {
      this.gameStarted = true;
      return;
    }

    if (this.gameOver) {
      this.player.vy = 0;
      this.player.speed = 0;
      return;
    }

    if (this.player.shootRequested) {
      const b = new Bullet(
        this.player.x + (this.player.facing === 1 ? this.player.width : -20),
        this.player.y + this.player.height / 2 - 6,
        this.player.facing,
      );
      this.world.add(b);
      this.player.shootRequested = false;
    }

    this.world.update(dt, this.player);

    if (!this.player.alive) {
      this.player.update(dt);
    }
    this.player.isGrounded = false;

    this.world.entities = this.world.entities.filter((e) => {
      if (e.tag === "bullet" && !e.active) return false;
      if (e.tag === "enemy" && !e.alive) return false;
      return true;
    });

    if (this.player.alive) {
      const entities = this.world.entities;
      const pairs = CollisionSystem.getPairs(entities);
      for (const [a, b] of pairs) {
        MovementSystem.resolvePlayerCollision(this.player, a, b);
      }
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
      (e) => e.tag === "enemy" && e.alive,
    );

    if (enemiesLeft.length === 0) {
      console.log("NO ENEMIES LEFT → GAME OVER");
      this.gameOver = true;
    }

    // Check for lava death
    if (this.player.alive && this.player.y > 600) {
      this.player.die();
    }

    if (!this.player.alive && this.player.y > 800 && !this.waitingForDeath) {
      this.waitingForDeath = true;
      this.deathTimer = 0.5;
    }
    if (this.waitingForDeath) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.lives--;
        try {
          if (typeof window !== "undefined" && window.sfxLifeLost) {
            window.sfxLifeLost.currentTime = 0;
            window.sfxLifeLost.play().catch(() => {});
          }
        } catch (e) {}
        if (typeof window !== "undefined" && window.updateLives) {
          window.updateLives(this.lives, 3);
        }

        if (this.lives > 0) {
          this.player.respawn(this.startX, this.startY);
          if (!this.world.entities.includes(this.player)) {
            this.world.add(this.player);
          }
          this.waitingForDeath = false;
          this.deathTimer = 0;
        } else {
          this.gameOver = true;
        }
      }
    }
  }

  render(ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    grad.addColorStop(0, "#87CEEB");
    grad.addColorStop(1, "#B3E5FC");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();

    const playerCenterX = this.player.x + this.player.width / 2;
    const canvasCenterX = ctx.canvas.width / 2;
    const cameraX = Math.max(
      0,
      Math.min(
        playerCenterX - canvasCenterX,
        this.levelWidth - ctx.canvas.width,
      ),
    );
    const cameraY = 0;

    ctx.translate(-cameraX, -cameraY);

    this.world.render(ctx);

    if (!this.player.alive) {
      this.player.render(ctx);
    }

    ctx.restore();
  }
}
