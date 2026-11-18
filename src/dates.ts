export function dateKey(date = new Date()): string {
  const part = (n: number) => String(n).padStart(2, '0');
  return date.getFullYear() + '-' + part(date.getMonth() + 1) + '-' + part(date.getDate());
}

export function addDays(day: string, offset: number): string {
  const date = new Date(day + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().split('T', 1)[0];
}

