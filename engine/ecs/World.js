export class World{
    constructor (){
        this.entities= [];
    }
add(entity) {
    this.entities.push(entity);
  }

update(dt) {
  for (const entity of this.entities) {
    if (entity.alive) {
      entity.update(dt);
    }
  }

  this.entities = this.entities.filter(e => e.alive !== false);  //used in removing the dead players
}


render(ctx) {
    for (const entity of this.entities) {
      entity.render(ctx);
    }
  }
}