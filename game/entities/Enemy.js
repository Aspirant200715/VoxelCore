import { Entity } from "../../engine/ecs/Entity.js";

export class Enemy extends Entity {
  constructor(x, y) {
    super(x, y, 120, 120);
    this.tag = "enemy";
    this.solid = true;
    this.alive = true;
    this.hitThisAttack = false;
    this.hp = 3;
    this.vx = 0;
    this.direction = 0;
    this.moveTimer = 0;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.alive = false;
    }
  }

  // Ground the enemy on platform
  ground() {
    this.y = 600 - this.height; // Position on ground
  }

  update(dt) {
    // Only update if alive
    if (!this.alive) return;

    // Random movement logic
    this.moveTimer -= dt;
    if (this.moveTimer <= 0) {
      this.moveTimer = Math.random() * 2 + 0.5; // Change direction every 0.5-2.5s
      const r = Math.random();
      if (r < 0.33) this.direction = -1;
      else if (r < 0.66) this.direction = 1;
      else this.direction = 0;
    }

    this.vx = this.direction * 100; // Move speed
    this.x += this.vx * dt;
  }
  //render command
  render(ctx) {
    // Retro Robot / Casino Chip Enemy
    ctx.save();

    // Body
    ctx.fillStyle = "#d9004c"; // Dark pink/red
    ctx.strokeStyle = "#ff00de"; // Neon pink
    ctx.lineWidth = 4;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Eyes
    ctx.fillStyle = "#00eaff"; // Cyan eyes
    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 10;
    ctx.fillRect(this.x + 24, this.y + 36, 24, 24);
    ctx.fillRect(this.x + 72, this.y + 36, 24, 24);
    ctx.shadowBlur = 0;

    // Mouth
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x + 24, this.y + 84, 72, 12);

    ctx.restore();

    // HP Bar
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 8, (this.hp / 3) * this.width, 4);
  }
}
