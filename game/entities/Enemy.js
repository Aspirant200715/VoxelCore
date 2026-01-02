import { Entity } from "../../engine/ecs/Entity.js";

export class Enemy extends Entity {
  constructor(x, y) {
    super(x, y, 100, 100);
    this.tag = "enemy";
    this.solid = true;
    this.alive = true;
    this.hitThisAttack = false;
    this.hp = 3; 
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.alive = false;
      console.log("Enemy HP:", this.hp);
    }
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
