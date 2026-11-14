import type { Card } from './cards.ts';
import { addDays } from './dates.ts';

export type Review = { due: string; streak: number; attempts: number; correct: number };
export type Grade = 'repetir' | 'lembrei';

export function grade(previous: Review | undefined, choice: Grade, today: string): Review {
  const correct = choice === 'lembrei';
  const streak = correct ? (previous?.streak ?? 0) + 1 : 0;
  const intervals = [1, 3, 7, 14, 30];
  return {
    streak,
    due: addDays(today, correct ? intervals[Math.min(streak - 1, intervals.length - 1)] : 0),
    attempts: (previous?.attempts ?? 0) + 1,
    correct: (previous?.correct ?? 0) + Number(correct),
  };
}

export function queue(cards: Card[], reviews: Record<string, Review>, today: string) {
  return cards.filter(card => !reviews[card.id] || reviews[card.id].due <= today).sort((a, b) =>
    (reviews[a.id]?.due ?? '').localeCompare(reviews[b.id]?.due ?? '') || a.id.localeCompare(b.id, undefined, { numeric: true }));
}

export function optionsFor(card: Card, deck: Card[], random = Math.random) {
  const choices = [...new Set(deck.map(item => item.name))].filter(name => name !== card.name);
  const options = [card.name];
  while (options.length < 4 && choices.length) options.push(choices.splice(Math.floor(random() * choices.length), 1)[0]);
  for (let index = options.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [options[index], options[other]] = [options[other], options[index]];
  }
  return options;
}
