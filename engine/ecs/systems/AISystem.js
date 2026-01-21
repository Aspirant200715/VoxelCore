export class AISystem {
  static update(player, entities, dt) {
    for (const e of entities) {
      if (e.tag !== "enemy"|| !e.alive) continue;

      const speed = 80;
      const distance = player.x - e.x;
      const stopDistance = 60; 

      if (Math.abs(distance) > stopDistance) {
        e.x += Math.sign(distance) * speed * dt;
      }
    }
  }
}