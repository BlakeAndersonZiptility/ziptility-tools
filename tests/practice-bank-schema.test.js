// Bank JSON schema tests: validates banks-src/*.json against the shape
// quiz-engine.js/quiz-logic.js expect and against their manifest.js entry.
// Reads the source file directly (no bundle/DOM setup needed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TESTS } from '../src/practice/manifest.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);

function loadBank(id) {
  const p = path.join(ROOT, 'banks-src', id + '.json');
  return JSON.parse(readFileSync(p, 'utf8'));
}

for (const t of TESTS) {
  test('banks-src/' + t.id + '.json matches its manifest entry and question shape', () => {
    const bank = loadBank(t.id);
    assert.equal(bank.id, t.id);
    assert.equal(bank.durationMin, t.durationMin);
    assert.equal(bank.refCount, t.refCount);
    assert.equal(bank.questions.length, t.questionCount);
    assert.ok(bank.version, 'bank is missing its content version stamp');

    const ids = new Set();
    for (const q of bank.questions) {
      assert.ok(q.id && !ids.has(q.id), 'duplicate or missing question id: ' + q.id);
      ids.add(q.id);
      assert.ok(Array.isArray(q.choices) && q.choices.length === 4, q.id + ': choices must have exactly 4 entries');
      for (const c of q.choices) assert.ok(c && c.trim().length, q.id + ': empty choice text');
      assert.ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 3, q.id + ': correctIndex out of range');
      assert.ok(q.text && q.text.trim().length, q.id + ': empty question text');
      assert.ok(q.explanation && q.explanation.trim().length, q.id + ': empty explanation');
    }
  });
}
