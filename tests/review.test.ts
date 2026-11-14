import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cards } from '../src/cards.ts';
import { grade, optionsFor, queue } from '../src/review.ts';

test('alfabetos incluem 24 letras gregas e 22 letras hebraicas e formas finais', () => {
  assert.equal(cards.filter(card => card.language === 'grego' && card.kind === 'alphabet').length, 24);
  assert.equal(cards.filter(card => card.language === 'hebraico' && card.kind === 'alphabet').length, 22);
  assert.ok(cards.some(card => card.script.includes('ς')));
  assert.ok(cards.some(card => card.script.includes('ך')));
});
test('cada carta tem ID distinto e vocabulário inclui referência', () => {
  assert.equal(new Set(cards.map(card => card.id)).size, cards.length);
  assert.ok(cards.filter(card => card.kind === 'words').every(card => card.reference));
});
test('revisão espaçada reage a acertos, erros e mudança de ano', () => {
  const first = grade(undefined, 'lembrei', '2026-12-31');
  assert.deepEqual(first, { streak: 1, due: '2027-01-01', attempts: 1, correct: 1 });
  const second = grade(first, 'lembrei', first.due);
  assert.equal(second.due, '2027-01-04');
  const miss = grade(second, 'repetir', second.due);
  assert.deepEqual(miss, { streak: 0, due: '2027-01-04', attempts: 3, correct: 2 });
});
test('fila inclui cartões novos ou vencidos', () => {
  const [a, b] = cards;
  assert.deepEqual(queue([a, b], { [a.id]: grade(undefined, 'lembrei', '2026-11-14') }, '2026-11-14'), [b]);
});
test('exercício traz uma resposta correta e três alternativas distintas', () => {
  const result = optionsFor(cards[0], cards.slice(0, 6), () => 0);
  assert.equal(new Set(result).size, 4);
  assert.equal(result.filter(item => item === 'Alfa').length, 1);
});
