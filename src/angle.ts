// Angles as the lessons write them: whole degrees, and the share of a full turn when
// it is a simple one.

export const degrees = (angle: number): string => `${Math.round(angle)}°`;

const NAMED: Record<string, string> = {
  "0/1": "no turn",
  "1/4": "a quarter turn",
  "1/2": "half a turn",
  "3/4": "three quarters of a turn",
  "1/1": "a full turn",
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// "a quarter turn" for 90°, "3/8 of a turn" for 135°; "" when the share needs more than
// eighths (40° is 1/9) or the angle isn't whole.
export function turnShare(angle: number): string {
  if (!Number.isInteger(angle) || angle < 0) return "";
  const k = gcd(angle, 360);
  const [top, bottom] = [angle / k, 360 / k];
  if (bottom > 8) return "";
  const share = `${top}/${bottom}`;
  return NAMED[share] ?? (top === 1 ? `1/${bottom} of a turn` : `${share} of a turn`);
}

// How an angle past a full turn goes round: "a full turn and 90° more" for 450°; "" below
// a full turn.
export function pastTurns(angle: number): string {
  const whole = Math.round(angle);
  if (whole < 360) return "";
  const turns = Math.floor(whole / 360);
  const rest = whole - 360 * turns;
  const counted = turns === 1 ? "a full turn" : `${turns} full turns`;
  return rest ? `${counted} and ${degrees(rest)} more` : counted;
}
