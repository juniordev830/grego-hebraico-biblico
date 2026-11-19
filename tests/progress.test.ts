import assert from 'node:assert/strict';
import { test } from 'node:test';
import { grade, parseProgress } from '../src/review.ts';

const progress = {
  reviews: { a1: grade(undefined, 'lembrei', '2026-11-19') },
  history: [{ card: 'a1', date: '2026-11-19', choice: 'lembrei' }],
};

test('o progresso mantém os cartões agendados e o histórico', () => {
  assert.deepEqual(parseProgress(JSON.stringify(progress)), progress);
});

test('revisões com datas inválidas e históricos incompletos são rejeitados', () => {
  assert.throws(() => parseProgress(JSON.stringify({ ...progress, history: [null] })), /Progresso de revisão inválido/);
  const a1 = { ...progress.reviews.a1, due: '2026-02-30' };
  assert.throws(() => parseProgress(JSON.stringify({ ...progress, reviews: { a1 } })), /Progresso de revisão inválido/);
});
