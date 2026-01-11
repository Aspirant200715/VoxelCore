import { aabb } from "../../physics/Collision.js";

export class CollisionSystem {
  static getPairs(entities) {
    const pairs = [];

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const a = entities[i];
        const b = entities[j];

        if (aabb(a, b)) {
          pairs.push([a, b]);
        }
      }
    }

    return pairs;
  }
}
