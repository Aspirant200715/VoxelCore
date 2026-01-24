export class MovementSystem {
  static resolvePlayerCollision(player, a, b) {
    const other = a === player ? b : a;
    if (other !== player && !other.solid) return;

    // Calculate AABB overlap
    const overlapX =
      Math.min(player.x + player.width, other.x + other.width) -
      Math.max(player.x, other.x);
    const overlapY =
      Math.min(player.y + player.height, other.y + other.height) -
      Math.max(player.y, other.y);

    if (overlapX > 0 && overlapY > 0) {
      // Determine collision direction based on smallest overlap
      // Prefer vertical landing if player was above the object in the previous frame
      const wasAboveLastFrame =
        typeof player.prevY === "number" &&
        player.prevY + player.height <= other.y + 2;

      if (!wasAboveLastFrame && overlapX < overlapY) {
        if (player.x < other.x) {
          // Player is to the left -> move left
          player.x = other.x - player.width;
        } else {
          // Player is to the right -> move right
          player.x = other.x + other.width;
        }
      } else {
        // Only land if we are NOT moving upwards (jumping)
        if (player.vy >= 0 && (player.vy > 0 || wasAboveLastFrame)) {
          // Player is falling onto the object
          player.y = other.y - player.height;
          player.vy = 0;
          player.isGrounded = true; // allows the jump to trigger again
        } else if (player.vy < 0 && !wasAboveLastFrame) {
          // Player hit the underside of the object (head bump)
          player.y = other.y + other.height;
          player.vy = 0;
        }
      }
    }
  }
}
