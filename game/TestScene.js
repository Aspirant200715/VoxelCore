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
    for (let i =0;i<3;i++){
    const enemy = new Enemy(300 + i*120, 50);
    this.enemies.push(enemy);
    this.world.add(enemy);
    }

  }

update(dt) {
  const entities = this.world.entities;
  let playerCollided = false;

  // reset hit flags
  for (const e of entities) {
    if (e.hit !== undefined) e.hit = false;
  }

  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const a = entities[i];
      const b = entities[j];

      if (!aabb(a, b)) continue;
      if (a.tag === "enemy") a.alive = false;
      if (b.tag === "enemy") b.alive = false;
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
  }
}

