export function aabb(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
// What this does (important, simple)
// This is AABB collision:
// Axis-Aligned Bounding Box
// Rectangles that are not rotated
// It answers one question only:
// “Are these two rectangles overlapping?”
// Returns:
// true → collision
// false → no collision