export class World {
  constructor() {
    this.entities = [];
  }

  add(entity) {
    this.entities.push(entity);
  }

  update(dt, player) {
    for (const e of this.entities) {
      if (e.alive && e.update) {
        e.update(dt, player);
      }
    }

    this.entities = this.entities.filter(e => e.alive !== false);//used to remove dead entities
  }

  render(ctx) {
    for (const e of this.entities) {
      e.render(ctx);
    }
  }
}
