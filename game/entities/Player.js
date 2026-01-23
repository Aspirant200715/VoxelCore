import { Entity } from "../../engine/ecs/Entity.js";
import { Keyboard } from "../../engine/input/Keyboard.js";

export class Player extends Entity {
  constructor(x, y, type = "warrior") {
    super(x, y, 60, 90);
    this.tag = "player";
    this.solid = true;
    this.type = type;
    this.sprite = null;
    //SPEED AND JUMP HEIGHT LOGIC
    const stats = {
      warrior: { speed: 250, jump: -920 }, // Increased jump force for platforming
      scout: { speed: 300, jump: -940 }, // Increased jump force for platforming
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
    this.shootRequested = false;
    this.shootCooldown = 0;
    this.attackCooldown = 0;
    this.alive = true;
    this.isMoving = false;

    // Create DOM element for GIF playback
    this.element = document.createElement("img");
    this.element.className = "player-gif";
    this.element.src =
      this.type === "scout"
        ? "d514bdd5cebd67d90fb502fadc64d1d0.gif"
        : "giphy.gif";
    this.element.style.position = "absolute";
    this.element.style.display = "none";
    this.element.style.pointerEvents = "none";
    this.element.style.zIndex = "10";
    this.element.style.imageRendering = "pixelated";

    // Append to game layer
    const container =
      document.getElementById("game-fullscreen-layer") || document.body;
    container.appendChild(this.element);

    // Load sprite for static rendering (idle state)
    this.sprite = new Image();
    this.sprite.src = this.element.src;
  }

  die() {
    if (!this.alive) return;
    this.alive = false;
    this.solid = false; // Disable collision to fall through ground
    this.vy = -600; // Death hop

    if (this.element) {
      this.element.style.filter = "grayscale(100%) brightness(50%)";
    }

    try {
      if (typeof window !== "undefined" && window.sfxPlayerDeath) {
        window.sfxPlayerDeath.play().catch(() => {});
      }
    } catch (err) {}
  }

  respawn(x, y) {
    this.x = x;
    this.y = y;
    this.alive = true;
    this.solid = true;
    this.vy = 0;
    this.vx = 0;
    this.element.style.filter = "none";
    this.element.style.display = "block";
    this.isGrounded = false;
  }

  update(dt) {
    // track previous vertical position for collision heuristics
    this.prevY = this.y;

    this.isMoving = false;
    if (this.alive) {
      if (Keyboard.isDown("ArrowRight") || Keyboard.isDown("KeyD")) {
        this.x += this.speed * dt;
        this.facing = 1;
        this.isMoving = true;
      }
      if (Keyboard.isDown("ArrowLeft") || Keyboard.isDown("KeyA")) {
        this.x -= this.speed * dt;
        this.facing = -1;
        this.isMoving = true;
      }
    }

    const jumpRequest = Keyboard.isDown("ArrowUp") || Keyboard.isDown("KeyW");
    if (this.alive && jumpRequest && this.isGrounded) {
      this.vy = this.jumpForce;
      this.isGrounded = false;
      // Play jump sound on actual jump (user gesture already performed when starting run)
      try {
        if (typeof window !== "undefined" && window.sfxJump) {
          const j = window.sfxJump.cloneNode();
          j.play().catch(() => {});
        }
      } catch (err) {}
    }

    this.vy += this.gravity * dt;
    this.y += this.vy * dt;

    // Shooting on Space
    if (this.shootCooldown > 0) {
      this.shootCooldown -= dt;
    }

    if (this.alive && Keyboard.isDown("Space") && this.shootCooldown <= 0) {
      this.shootRequested = true;
      this.shootCooldown = 0.25;
      // Play shoot sound
      try {
        if (typeof window !== "undefined" && window.sfxAttack) {
          const a = window.sfxAttack.cloneNode();
          a.playbackRate = 1.5; // Higher pitch for laser shot
          a.play().catch(() => {});
        }
      } catch (err) {}
    }

    // Bounds
    if (this.x < 0) this.x = 0;
  }

  render(ctx) {
    // Calculate screen position based on camera transform
    const t = ctx.getTransform();
    const canvas = ctx.canvas;
    const rect = canvas.getBoundingClientRect();

    const scaleX = rect.width / canvas.width;
    const scaleY = rect.height / canvas.height;

    // Visual dimensions
    const targetRenderWidth = 104;
    const targetRenderHeight = 99;

    // Calculate world position for the sprite (centered over hitbox)
    const worldDrawX = this.x - (targetRenderWidth - this.width) / 2;
    const worldDrawY = this.y - (targetRenderHeight - this.height) + 6;

    // If player is alive and not moving, draw static frame to canvas (pauses animation)
    if (this.alive && !this.isMoving) {
      this.element.style.display = "none";
      ctx.save();
      if (this.facing === -1) {
        ctx.translate(
          worldDrawX + targetRenderWidth / 2,
          worldDrawY + targetRenderHeight / 2,
        );
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.sprite,
          -targetRenderWidth / 2,
          -targetRenderHeight / 2,
          targetRenderWidth,
          targetRenderHeight,
        );
      } else {
        ctx.drawImage(
          this.sprite,
          worldDrawX,
          worldDrawY,
          targetRenderWidth,
          targetRenderHeight,
        );
      }
      ctx.restore();
      return;
    }

    // Transform to screen coordinates
    const screenX = worldDrawX * t.a + t.e;
    const screenY = worldDrawY * t.d + t.f;

    // Apply CSS scaling
    const finalX = rect.left + screenX * scaleX;
    const finalY = rect.top + screenY * scaleY;
    const finalW = targetRenderWidth * scaleX;
    const finalH = targetRenderHeight * scaleY;

    this.element.style.display = "block";
    this.element.style.left = `${finalX}px`;
    this.element.style.top = `${finalY}px`;
    this.element.style.width = `${finalW}px`;
    this.element.style.height = `${finalH}px`;

    if (this.facing === -1) {
      this.element.style.transform = "scaleX(-1)";
    } else {
      this.element.style.transform = "scaleX(1)";
    }

    if (this.y > 2000) {
      this.element.style.display = "none";
    }
  }
}
