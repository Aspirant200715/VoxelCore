  import { Entity } from "../../engine/ecs/Entity.js";
  import { Keyboard } from "../../engine/input/Keyboard.js";

  export class Player extends Entity {
    constructor(x, y) {
      super(x, y,100,100);
      this.speed = 200;
      this.tag = "player";
      this.solid = true;
      this.alive = true;
      this.isAttacking = false;
      this.attackCooldown = 0; //seconds
      this.facing=1; //1:right, -1:left
      this.wasSpaceDown = false;


    }

  update(dt) {
      const oldX = this.x;
      this.isAttacking = Keyboard.isDown("Space");

      if (Keyboard.isDown("ArrowRight")) {
        this.x += this.speed * dt;
        this.facing = 1;
      }
      if (Keyboard.isDown("ArrowLeft")) {
        this.x -= this.speed * dt;
        this.facing = -1;
      }
      if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
      this.isAttacking = false;
      } 

    const spaceDown = Keyboard.isDown("Space");

    if (
  spaceDown &&
  !this.wasSpaceDown &&
  this.attackCooldown <= 0
) {
  this.isAttacking = true;
  this.attackCooldown = 0.25;
}

this.wasSpaceDown = spaceDown;

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
