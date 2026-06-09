// Restaurant opening hours in Africa/Algiers timezone.
// Sat-Thu: 10:00 -> 01:30 next day. Friday: 14:00 -> 01:30 next day.

function getAlgiersParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Algiers",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const weekday = weekdayMap[get("weekday")] ?? 0;
  let hour = parseInt(get("hour"), 10);
  if (hour === 24) hour = 0;
  const minute = parseInt(get("minute"), 10);
  return { weekday, minutes: hour * 60 + minute };
}

export function isRestaurantOpen(now: Date = new Date()): boolean {
  const { weekday, minutes } = getAlgiersParts(now);
  // 5 = Friday. Opens at 14:00 on Fri, 10:00 other days.
  const openMin = weekday === 5 ? 14 * 60 : 10 * 60;
  // Tail from previous day's session: always open until 01:30 (90 min).
  if (minutes < 90) return true;
  // Current day's session.
  if (minutes >= openMin) return true;
  return false;
}
