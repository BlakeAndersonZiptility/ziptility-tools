// Practice-quiz pure-logic tests (src/practice/quiz-logic.js). Direct ESM
// imports, no DOM needed. Mirrors the solvers.test.js convention.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  shuffle, fmtClock, sizesAvailable, examMinutes, drawQuestions, scoreAttempt, weakestFirstDomains
} from '../src/practice/quiz-logic.js';

test('fmtClock formats mm:ss, zero-padding seconds', () => {
  assert.equal(fmtClock(0), '0:00');
  assert.equal(fmtClock(5), '0:05');
  assert.equal(fmtClock(65), '1:05');
  assert.equal(fmtClock(600), '10:00');
  assert.equal(fmtClock(3661), '61:01');
});

test('sizesAvailable offers 25/50/100 only when smaller than the bank, plus the full count last', () => {
  assert.deepEqual(sizesAvailable(110), [25, 50, 100, 110]);
  assert.deepEqual(sizesAvailable(30), [25, 30]);
  assert.deepEqual(sizesAvailable(10), [10]);
  assert.deepEqual(sizesAvailable(100), [25, 50, 100]);
});

test('examMinutes scales duration by size/refCount, floors at 10', () => {
  assert.equal(examMinutes(25, 100, 110, 120), 30);
  assert.equal(examMinutes(100, 100, 110, 120), 120);
  assert.equal(examMinutes(1, 100, 110, 120), 10);
  // falls back to questionCount when refCount is falsy, and to 120 when durationMin is falsy
  assert.equal(examMinutes(50, 0, 200, 0), 30);
});

test('shuffle mutates and returns the same array, preserving every element', () => {
  const arr = [1, 2, 3, 4, 5];
  const ref = shuffle(arr);
  assert.equal(ref, arr);
  assert.deepEqual([...arr].sort((a, b) => a - b), [1, 2, 3, 4, 5]);
});

function fakeQuestions(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push({ id: 'q' + i, choices: ['a', 'b', 'c', 'd'], correctIndex: i % 4, domain: i <= n / 2 ? 'MATH' : 'REGS' });
  }
  return out;
}

test('drawQuestions draws unseen questions first and shapes {q, order, correctPos}', () => {
  const all = fakeQuestions(6);
  const seenIds = ['q4', 'q5', 'q6'];
  const picked = drawQuestions(all, seenIds, 3);
  assert.equal(picked.length, 3);
  for (const item of picked) {
    assert.ok(['q1', 'q2', 'q3'].includes(item.q.id), 'unseen questions should be drawn before seen ones');
    assert.deepEqual([...item.order].sort(), [0, 1, 2, 3]);
    assert.equal(item.order[item.correctPos], item.q.correctIndex);
  }
});

test('drawQuestions requesting the full bank returns every question exactly once', () => {
  const all = fakeQuestions(6);
  const picked = drawQuestions(all, [], 6);
  assert.equal(picked.length, 6);
  assert.deepEqual(picked.map((it) => it.q.id).sort(), ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']);
});

test('scoreAttempt tallies correct/pct/byDomain/missed', () => {
  const qs = [
    { q: { domain: 'MATH' }, correctPos: 0 },
    { q: { domain: 'MATH' }, correctPos: 1 },
    { q: { domain: 'REGS' }, correctPos: 2 }
  ];
  const answers = { 0: 0, 1: 0, 2: 2 }; // question index 1 wrong, 0 and 2 right
  const result = scoreAttempt(qs, answers);
  assert.equal(result.correct, 2);
  assert.equal(result.n, 3);
  assert.equal(result.pct, 67);
  assert.equal(result.byDomain.MATH.n, 2);
  assert.equal(result.byDomain.MATH.ok, 1);
  assert.equal(result.byDomain.REGS.ok, 1);
  assert.equal(result.missed.length, 1);
  assert.equal(result.missed[0].sel, 0);
});

test('weakestFirstDomains sorts ascending by ok/n ratio', () => {
  const byDomain = { A: { ok: 9, n: 10 }, B: { ok: 1, n: 10 }, C: { ok: 5, n: 10 } };
  assert.deepEqual(weakestFirstDomains(byDomain), ['B', 'C', 'A']);
});
