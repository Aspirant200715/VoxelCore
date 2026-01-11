import { Entity } from "../../engine/ecs/Entity.js";

export class Enemy extends Entity {
  constructor(x, y) {
    super(x, y, 100, 100);
    this.tag = "enemy";
    this.solid = true;
    this.alive = true;
    this.hitThisAttack = false;
    this.hp = 3; 
    this.vx = 0;
    this.direction = 0;
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.vx = 300 * this.direction;
    if (this.hp <= 0) {
      this.alive = false;
      console.log("Enemy HP:", this.hp);
    }
  }
update(dt) {
  this.x += this.vx * dt;
  this.vx *= 0.9;

  if (Math.abs(this.vx) < 1) this.vx = 0;
}



  render(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y - 8, this.width, 4);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 8, (this.hp / 3) * this.width, 4);
  }
}
