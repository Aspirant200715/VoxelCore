import { Entity } from "../../engine/ecs/Entity.js";

export class Bullet extends Entity {
  constructor(x, y, direction) {
    super(x, y, 24, 12);
    this.tag = "bullet";
    this.speed = 1000;
    this.direction = direction;
    this.solid = false;
    this.active = true;
    this.lifeTime = 1.5;
  }
//physics behind bullets hitting
  update(dt) {
    this.x += this.speed * this.direction * dt;
    this.lifeTime -= dt;
    if (this.lifeTime <= 0) this.active = false;
  }

  render(ctx) {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#00eaff";
    ctx.shadowBlur = 15;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
