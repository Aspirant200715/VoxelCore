import { Entity } from "../../engine/ecs/Entity.js";
import { Keyboard } from "../../engine/input/Keyboard.js";

export class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.speed = 200;
  }

update(dt) {
    if (Keyboard.isDown("ArrowRight")) {
      this.x += this.speed * dt;
    }
    if (Keyboard.isDown("ArrowLeft")) {
      this.x -= this.speed * dt;
    }
  }

render(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, 100, 100);
  }
}
