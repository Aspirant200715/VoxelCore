import { aabb } from "../../physics/Collision.js";

export class CombatSystem {
  static handle(player, entities, attackBox) {
    if (!attackBox || !player.isAttacking) return;

    for (const e of entities) {
      if (e.tag !== "enemy") continue;
      if (e.hitThisAttack) continue;

      if (aabb(attackBox, e)) {
        e.takeDamage(1, player.facing);
        e.hitThisAttack = true;
      }
    }
  }

  static resetHitLocks(player, entities) {
    if (player.isAttacking) return;

    for (const e of entities) {
      if (e.tag === "enemy") {
        e.hitThisAttack = false;
      }
    }
  }
}
