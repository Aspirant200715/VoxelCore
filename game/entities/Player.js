import { Entity } from "../../engine/ecs/Entity.js";
import { Keyboard } from "../../engine/input/Keyboard.js";

export class Player extends Entity {
  constructor(x, y, type = "warrior") {
    super(x, y, 40, 60);
    this.tag = "player";
    this.solid = true;
    this.type = type;
    this.sprite = null;
  //SPEED AND JUMP HEIGHT LOGIC
    const stats = {
      warrior: { speed: 250,jump: -920 },//setting the jump height
      scout: { speed: 300,jump: -920 }, //speec controlled jump
    };

    const choice = stats[type] || stats.warrior;
    this.speed = choice.speed;
    this.color = choice.color;
    this.jumpForce = choice.jump;

    this.vy = 0;
    this.gravity = 2000;
    this.isGrounded = false;
    this.facing = 1;
    this.isAttacking = false;
    this.attackCooldown = 0;
  }

  update(dt) {
    if (Keyboard.isDown("ArrowRight") || Keyboard.isDown("KeyD")) {
      this.x += this.speed * dt;
      this.facing = 1;
    }
    if (Keyboard.isDown("ArrowLeft") || Keyboard.isDown("KeyA")) {
      this.x -= this.speed * dt;
      this.facing = -1;
    }

    this.vy += this.gravity * dt;
    this.y += this.vy * dt;

    // 3. Screen Floor Check (Crucial for Jumping)
    // This ensures that even if your collision system fails, the player can jump from the bottom
  if (this.vy >= 0 && this.y + this.height >= 360) {
   this.y = 360 - this.height;
   this.vy = 0;
   this.isGrounded = true;
  }

    const jumpRequest = Keyboard.isDown("ArrowUp") || Keyboard.isDown("KeyW");
    if (jumpRequest && this.isGrounded) {
      this.vy = this.jumpForce;
      this.isGrounded = false;
    }

    // Attack strictly on Space
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
      this.isAttacking = false;
    } else if (Keyboard.isDown("Space")) {
      this.isAttacking = true;
      this.attackCooldown = 0.35;
    }

    // Bounds
   if (this.x < 0) this.x = 0;
  }

  render(ctx) {
    if (!this.sprite) {
      this.sprite = new Image();
      this.sprite.src =
        this.type === "scout"
          ? "d514bdd5cebd67d90fb502fadc64d1d0.gif"
          : "giphy.gif";
    }

    const drawWidth = 69;
    const drawHeight = 66;

    ctx.save();

    if (this.facing === -1) {
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.sprite,
        -this.x - drawWidth,
        this.y,
        drawWidth,
        drawHeight,
      );
    } else {
      ctx.drawImage(this.sprite, this.x, this.y, drawWidth, drawHeight);
    }

    ctx.restore();
  }
}
