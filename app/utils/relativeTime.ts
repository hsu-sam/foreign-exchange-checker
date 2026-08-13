export function formatRelativeTime(from: Date, to: Date = new Date()): string {
  const diffSeconds = Math.floor((to.getTime() - from.getTime()) / 1000);

  if (diffSeconds < 60) return "NOW";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}M`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}H`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}D`;

  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks}W`;
}
