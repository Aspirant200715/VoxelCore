export class MovementSystem {
  static resolvePlayerCollision(player, a, b) {
  const other = a === player ? b : a;
  if (other !== player && !other.solid) return;
    // Calculate AABB overlap
    const overlapX = Math.min(player.x + player.width, other.x + other.width) - Math.max(player.x, other.x);
    const overlapY = Math.min(player.y + player.height, other.y + other.height) - Math.max(player.y, other.y);

    if (overlapX > 0 && overlapY > 0) {
if (overlapX < overlapY) {
    player.x += (player.x < other.x) ? -overlapX : overlapX;
} else {
    if (player.y < other.y) { // If player is falling ONTO the object
        player.y -= overlapY;
        player.vy = 0;
        player.isGrounded = true; // allows the jump to trigger again
    } else {
        player.y += overlapY;
        player.vy = 0;
    }
}
    }
  }
}