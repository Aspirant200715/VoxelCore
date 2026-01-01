import { Entity } from "../../engine/ecs/Entity.js";
export class Enemy extends Entity {
  constructor(x, y) {
    super(x, y, 100, 100);
    this.tag = "enemy";
    this.alive = true;
    this.solid = true; // for collision purposes
  }

  render(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}