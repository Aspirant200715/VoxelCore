import { Scene } from "../engine/core/Scene.js";
import { World } from "../engine/ecs/World.js";
import { Player } from "./entities/Player.js";
import { Enemy } from "./entities/Enemy.js";

import { CollisionSystem } from "../engine/ecs/systems/CollisionSystem.js";
import { CombatSystem } from "../engine/ecs/systems/CombatSystem.js";
import { MovementSystem } from "../engine/ecs/systems/MovementSystem.js";
import { AISystem } from "../engine/ecs/systems/AISystem.js";


export class TestScene extends Scene {
  constructor() {
    super();
    this.world = new World();

    this.player = new Player(50, 50);
    this.world.add(this.player);

    for (let i = 0; i < 3; i++) {
      this.world.add(new Enemy(300 + i * 120, 50));
    }
  }

update(dt) {
  const entities = this.world.entities;

  AISystem.update(this.player, entities, dt);

  const attackBox = this.getPlayerAttackBox();

  CombatSystem.resetHitLocks(this.player, entities);
  CombatSystem.handle(this.player, entities, attackBox);

  const pairs = CollisionSystem.getPairs(entities);
  for (const [a, b] of pairs) {
    MovementSystem.resolvePlayerCollision(this.player, a, b);
  }

  this.world.update(dt, this.player);
}


  render(ctx) {
    this.world.render(ctx);

    const box = this.getPlayerAttackBox();
    if (box) {
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    }
  }

  getPlayerAttackBox() {
    if (!this.player.isAttacking) return null;

    const size = 40;
    return {
      x: this.player.facing === 1
        ? this.player.x + this.player.width
        : this.player.x - size,
      y: this.player.y + 30,
      width: size,
      height: 40
    };
  }
}
