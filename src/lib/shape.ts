/**
 * Material 3 Expressive shapes, generated as SVG paths in a 100x100 viewBox.
 *
 * Every shape is traced the same way: `POINTS` rays from the centre, one
 * radius each. Because all paths share a point count, CSS can morph any
 * shape into any other.
 */
const POINTS = 180;

/** Radius (0..1 of the half-size) for an angle in radians. */
type Radius = (theta: number) => number;

function trace(radius: Radius): string {
  const coords: string[] = [];
  for (let i = 0; i < POINTS; i++) {
    const theta = (i / POINTS) * Math.PI * 2;
    const r = 50 * Math.min(1, Math.max(0, radius(theta)));
    coords.push(`${(50 + r * Math.cos(theta)).toFixed(1)} ${(50 + r * Math.sin(theta)).toFixed(1)}`);
  }
  return `M${coords.join('L')}Z`;
}

/** Turns an "is this point inside?" test (x, y in -1..1, y down) into a radius function. */
function outline(inside: (x: number, y: number) => boolean): Radius {
  return (theta) => {
    let lo = 0;
    let hi = 1.5;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inside(mid * Math.cos(theta), mid * Math.sin(theta))) lo = mid;
      else hi = mid;
    }
    return lo;
  };
}

/** Scalloped circle: `lobes` soft bumps. Low depth reads as a cookie, high depth as a clover. */
export function scallop(lobes: number, depth = 0.09): string {
  return trace((theta) => 1 - depth + depth * Math.cos(lobes * theta));
}

/** Round petals meeting in sharp valleys. */
export function flower(petals: number, depth = 0.26): string {
  return trace((theta) => 1 - depth + depth * Math.abs(Math.cos((petals * theta) / 2)));
}

/**
 * Star with straight edges, sharp points and sharp valleys. Use a point count
 * that divides POINTS into an even number of samples (10, 15, 18, 30...) so
 * every tip and valley lands exactly on a sample.
 */
export function burst(points: number, depth = 0.2): string {
  const half = Math.PI / points;
  const inner = 1 - depth;
  return trace((theta) => {
    // Angle from the nearest tip, folded into 0..half.
    const phi = Math.abs((((theta + half) % (2 * half)) + 2 * half) % (2 * half) - half);
    // Polar form of the straight line from a tip (r = 1) to a valley (r = inner).
    return (inner * Math.sin(half)) / (Math.sin(phi) + inner * Math.sin(half - phi));
  });
}

/** Regular polygon with rounded corners; one corner points up. */
export function polygon(sides: number, sharpness = 14): string {
  const step = (Math.PI * 2) / sides;
  return trace((theta) => {
    const local = (((theta + Math.PI / 2) % step) + step) % step;
    const edge = (1.1 * Math.cos(step / 2)) / Math.cos(local - step / 2);
    // Smooth minimum of the polygon and the unit circle rounds the corners off.
    return (edge ** -sharpness + 1) ** (-1 / sharpness);
  });
}

/** Capsule leaning 45 degrees. */
export function pill(): string {
  const a = 0.5;
  const r = 0.29;
  return trace(
    outline((x, y) => {
      // Distance to the segment (-a, a) -> (a, -a).
      const t = Math.min(1, Math.max(0, ((x + a) * 2 * a + (y - a) * -2 * a) / (8 * a * a)));
      return Math.hypot(x - (-a + 2 * a * t), y - (a - 2 * a * t)) <= r;
    }),
  );
}

/** Rectangle with a semicircular top. */
export function arch(): string {
  const w = 0.7;
  const bottom = 0.92;
  const corner = 0.14;
  return trace(
    outline((x, y) => {
      const ax = Math.abs(x);
      if (ax > w || y > bottom) return false;
      if (y < -0.22) return Math.hypot(x, y + 0.22) <= w;
      // Round the two bottom corners.
      if (ax > w - corner && y > bottom - corner) return Math.hypot(ax - (w - corner), y - (bottom - corner)) <= corner;
      return true;
    }),
  );
}

/** Quarter circle. */
export function fan(): string {
  const edge = 0.74;
  const corner = 0.16;
  return trace(
    outline((x, y) => {
      if (x < -edge || y > edge || Math.hypot(x + edge, y - edge) > 1.56) return false;
      // Round the square corner.
      if (x < -edge + corner && y > edge - corner) return Math.hypot(x + edge - corner, y - edge + corner) <= corner;
      return true;
    }),
  );
}

/** Heart. */
export function heart(): string {
  return trace(
    outline((x, y) => {
      const X = x * 1.22;
      const Y = -y * 1.22 + 0.22;
      return (X * X + Y * Y - 1) ** 3 - X * X * Y ** 3 <= 0;
    }),
  );
}

export const shapes = {
  /** Soft scalloped circle. `lobes` sets the bump count (default 8). */
  cookie: (lobes = 8, depth = 0.09) => scallop(lobes, depth),
  /** Four deep lobes. */
  clover: (lobes = 4, depth = 0.2) => scallop(lobes, depth),
  flower: (petals = 8, depth = 0.26) => flower(petals, depth),
  burst: (points = 10, depth = 0.24) => burst(points, depth),
  /** Many shallow points, like a seal. */
  sunny: (points = 18, depth = 0.1) => burst(points, depth),
  pentagon: () => polygon(5),
  diamond: () => polygon(4),
  triangle: () => polygon(3, 9),
  pill,
  arch,
  fan,
  heart,
} as const;

export type ShapeKind = keyof typeof shapes;
