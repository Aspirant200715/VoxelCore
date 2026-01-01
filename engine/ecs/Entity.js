export class Entity {
  constructor(x, y, width = 50, height = 50, tag = "generic") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.tag = tag;
    this.alive = true;
  }

  update(dt) {}
  render(ctx) {}
}
