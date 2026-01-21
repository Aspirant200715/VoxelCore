export class Keyboard {
  static keys = {};
  static init() {
    window.addEventListener("keydown", (e) => {
      Keyboard.keys[e.code] = true;
      if (e.code === "Space") {
        e.preventDefault();
      }
    });
    window.addEventListener("keyup", (e) => {
      Keyboard.keys[e.code] = false;
    });
  }
  static isDown(code) {
    return !!Keyboard.keys[code];
  }
}
