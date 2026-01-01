import { Entity } from "../../engine/ecs/Entity.js";
import { Keyboard } from "../../engine/input/Keyboard.js";

export class Player extends Entity {
  constructor(x, y) {
    super(x, y,100,100);
    this.speed = 200;
  }

update(dt) {
    const oldX = this.x;
    if (Keyboard.isDown("ArrowRight")) {
      this.x += this.speed * dt;
    }
    if (Keyboard.isDown("ArrowLeft")) {
      this.x -= this.speed * dt;
    }
     //screen bounding 
  if (this.x < 0) this.x = 0;
    if (this.x + this.width > 800) {
      this.x = 800 - this.width;
    }
    this.oldX = oldX; //imp line as the oldX is used in TestScene.js for collision response
  }
 

render(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, 100, 100);
  }
}
