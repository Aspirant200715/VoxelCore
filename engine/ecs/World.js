export class World {
  constructor() {
    this.entities = [];
  }
  add(entity) {
    this.entities.push(entity);
  }

  update(dt, player) {
  for (const entity of this.entities) {
    if (!entity.update) continue;

    if (entity.update.length === 2) {
      entity.update(dt, player);
    } else {
      entity.update(dt);
    }
  }

  // REMOVE DEAD ENTITIES
  this.entities = this.entities.filter(e => e.alive !== false);  //very imp line for removing the dead enemies 
}

  render(ctx) {
    for (const e of this.entities) {
      e.render(ctx);
    }
  }
}
