import {Scene} from "../engine/core/Scene.js";
import {World} from "../engine/ecs/World.js";
import {Player} from "./entities/Player.js";

export class TestScene extends Scene {
  constructor() {
    super();
    this.world = new World();

    const player = new Player(50, 50);
    this.world.add(player);
  }

  update(dt) {
    this.world.update(dt);
  }

  render(ctx) {
    this.world.render(ctx);
  }
}
