export class Entity {
  constructor(x, y, width = 50, height = 50, tag = "generic") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.tag = "entity";
    this.alive = true;
    this.solid = false; // for collision purposes
  }

  update(dt) {}
  render(ctx) {}
}
