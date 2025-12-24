export class World{
    constructor (){
        this.entities= [];
    }
add(entity) {
    this.entities.push(entity);
  }

update(dt) {
    for (const entity of this.entities) {
      entity.update(dt);
    }
  }

render(ctx) {
    for (const entity of this.entities) {
      entity.render(ctx);
    }
  }
}