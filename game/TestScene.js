import { Scene } from "../engine/core/Scene.js";
import { World } from "../engine/ecs/World.js";
import { Player } from "./entities/Player.js";
import { Enemy } from "./entities/Enemy.js";
import { aabb } from "../engine/physics/Collision.js";

export class TestScene extends Scene {
  constructor() {
    super();
    this.world = new World();

    this.player = new Player(50, 50);

    this.world.add(this.player);

    this.enemies = [];
    for (let i = 0; i < 3; i++) {
      //enemy creation control from here
      const enemy = new Enemy(300 + i * 120, 50);
      this.enemies.push(enemy);
      this.world.add(enemy);
    }
  }

 update(dt) {
  const entities = this.world.entities;
  let playerCollided = false;

  const attackBox = this.getPlayerAttackBox();

 
  if (!this.player.isAttacking) {
    for (const e of entities) {
      if (e.tag === "enemy") {
        e.hitThisAttack = false;
      }
    }
  }

  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const a = entities[i];
      const b = entities[j];

      if (attackBox) {
        if (
          a.tag === "enemy" &&
          !a.hitThisAttack &&
          aabb(attackBox, a)
        ) {
          a.takeDamage(1);
          a.hitThisAttack = true; 
          continue;
        }

        if (
          b.tag === "enemy" &&
          !b.hitThisAttack &&
          aabb(attackBox, b)
        ) {
          b.takeDamage(1);
          b.hitThisAttack = true;
          continue;
        }
      }

      if (!aabb(a, b)) continue;

      if (
        (a === this.player && b.solid) ||
        (b === this.player && a.solid)
      ) {
        playerCollided = true;
      }
    }
  }

  if (playerCollided) {
    this.player.x = this.player.oldX;
  }

  this.world.update(dt);
}



  render(ctx) {
    this.world.render(ctx);
    //temporaary testing of attack box
    const attackBox = this.getPlayerAttackBox();
    if (attackBox) {
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(
        attackBox.x,
        attackBox.y,
        attackBox.width,
        attackBox.height
      );
    }
  }
  ///helper function to test for player attack box
  getPlayerAttackBox() {
    const p = this.player;

    if (!p.isAttacking) return null;

    const size = 40;

    return {
      x: p.facing === 1 ? p.x + p.width : p.x - size,
      y: p.y + 30,
      width: size,
      height: 40,
    };
  }
}
