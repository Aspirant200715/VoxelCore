export class MovementSystem {
  static resolvePlayerCollision(player, a, b) {
    if (
      (a === player && b.solid) ||
      (b === player && a.solid)
    ) {
      player.x = player.oldX;
    }
  }
}
