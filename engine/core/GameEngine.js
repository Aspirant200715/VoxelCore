export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.lastTime = 0;
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
    this.scene = null;
  }

  loop(time) {
    const deltaTime = (time - this.lastTime) / 1000; //convert to milliseconds
    this.lastTime = time;
    this.update(deltaTime);
    this.render();
    requestAnimationFrame(this.loop);
  }

  update(dt) {
    if (this.scene){
        this.scene.update(dt);
    }
  }

  setScene(scene){
    this.scene= scene;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // console.log("rendering");
    if (this.scene){
        this.scene.render(this.ctx)
    }
  }


}
