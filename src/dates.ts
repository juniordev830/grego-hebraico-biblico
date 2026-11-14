export function dateKey(date = new Date()): string {
  const part = (n: number) => String(n).padStart(2, '0');
  return date.getFullYear() + '-' + part(date.getMonth() + 1) + '-' + part(date.getDate());
}

export function addDays(day: string, offset: number): string {
  const date = new Date(day + 'T12:00:00');
  date.setDate(date.getDate() + offset);
  return dateKey(date);
}

