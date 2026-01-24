import { aabb } from "../../physics/Collision.js";

export class CombatSystem {
  static handle(player, entities, attackBox) {
    const bullets = entities.filter((e) => e.tag === "bullet" && e.active);
    const enemies = entities.filter((e) => e.tag === "enemy" && e.alive);

    for (const b of bullets) {
      for (const e of enemies) {
        if (aabb(b, e)) {
          e.takeDamage(1);
          b.active = false;

          try {
            if (typeof window !== "undefined" && window.sfxHit) {
              const s = window.sfxHit.cloneNode();
              s.play().catch(() => {});
            }
          } catch (err) {}

          if (!e.alive) {
            if (
              typeof window !== "undefined" &&
              typeof window.addScore === "function"
            ) {
              window.addScore(10);
            }
            if (
              typeof window !== "undefined" &&
              typeof window.addKill === "function"
            ) {
              window.addKill(1);
            }
          }
        }
      }
    }

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
        try {
          if (typeof window !== "undefined" && window.sfxHit) {
            const s = window.sfxHit.cloneNode();
            s.play().catch(() => {});
          }
        } catch (err) {}
        if (e.alive === false) {
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
          if (
            typeof window !== "undefined" &&
            typeof window.addKill === "function"
          ) {
            window.addKill(1);
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
