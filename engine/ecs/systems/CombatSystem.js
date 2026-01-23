import { aabb } from "../../physics/Collision.js";

export class CombatSystem {
  static handle(player, entities, attackBox) {
    // Handle Bullets
    const bullets = entities.filter((e) => e.tag === "bullet" && e.active);
    const enemies = entities.filter((e) => e.tag === "enemy" && e.alive);

    for (const b of bullets) {
      for (const e of enemies) {
        if (aabb(b, e)) {
          e.takeDamage(1);
          b.active = false;

          // Hit sound
          try {
            if (typeof window !== "undefined" && window.sfxHit) {
              const s = window.sfxHit.cloneNode();
              s.play().catch(() => {});
            }
          } catch (err) {}

          if (!e.alive) {
            // Kill logic handled below or in next frame
            if (
              typeof window !== "undefined" &&
              typeof window.addScore === "function"
            ) {
              window.addScore(10);
            }
          }
        }
      }
    }

    // Player vs Enemy Collision (Death)
    if (player.alive) {
      for (const e of enemies) {
        if (aabb(player, e)) {
          player.die();
          break;
        }
      }
    }

    if (!attackBox || !player.isAttacking) return;

    for (const e of entities) {
      if (e.tag !== "enemy") continue;
      if (e.hitThisAttack) continue;

      if (aabb(attackBox, e)) {
        e.takeDamage(1, player.facing);
        // Play hit sound (clone to allow overlapping playback)
        try {
          if (typeof window !== "undefined" && window.sfxHit) {
            const s = window.sfxHit.cloneNode();
            s.play().catch(() => {});
          }
        } catch (err) {}
        // Award score if this hit killed the enemy
        if (e.alive === false) {
          // Play enemy-kill sound
          try {
            if (typeof window !== "undefined" && window.sfxKill) {
              const k = window.sfxKill.cloneNode();
              k.play().catch(() => {});
            }
          } catch (err) {}
          if (
            typeof window !== "undefined" &&
            typeof window.addScore === "function"
          ) {
            window.addScore(4);
          }
        }
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
