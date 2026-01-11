export class AISystem {
  static update(player, entities, dt) {
    for (const e of entities) {
      if (e.tag !== "enemy") continue;
      if (!e.alive) continue;

      // simple follow AI
      const speed = 60;
      const distance = player.x - e.x;

      if (Math.abs(distance) > 5) {
        e.x += Math.sign(distance) * speed * dt;
      }
    }
  }
}
