// Bank JSON schema tests: validates banks-src/*.json against the shape
// quiz-engine.js/quiz-logic.js expect and against their manifest.js entry.
// Reads the source file directly (no bundle/DOM setup needed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TESTS, validate } from '../src/practice/manifest.js';

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

// ---------------------------------------------------------------------
// manifest.js validate(): slug + description enforcement (Q-12 split).
// A minimal, otherwise-valid entry so each assertion below breaks exactly
// one field at a time.
// ---------------------------------------------------------------------
function validTest(overrides = {}) {
  return {
    id: 'sample-1',
    slug: 'sample',
    title: 'Sample practice test',
    badge: 'Sample badge',
    discipline: 'Sample',
    level: 'Entry level',
    description: 'A sample description for schema tests.',
    questionCount: 10,
    durationMin: 30,
    refCount: 5,
    bankVersion: '1.0.0',
    ...overrides
  };
}

test('validate() rejects an entry missing a slug', () => {
  assert.throws(() => validate([validTest({ slug: undefined })]), /missing or non-kebab-case slug/);
});

test('validate() rejects non-kebab-case slugs', () => {
  for (const badSlug of ['Water_Treatment', 'water treatment', 'water-treatment/']) {
    assert.throws(() => validate([validTest({ slug: badSlug })]), /missing or non-kebab-case slug/,
      'slug "' + badSlug + '" should have failed the kebab-case check');
  }
});

test('validate() rejects duplicate slugs across two entries', () => {
  const entries = [
    validTest({ id: 'a-1', slug: 'dup' }),
    validTest({ id: 'b-1', slug: 'dup' })
  ];
  assert.throws(() => validate(entries), /duplicate slug "dup"/);
});

test('validate() rejects an entry missing a description', () => {
  assert.throws(() => validate([validTest({ description: undefined })]), /missing a required label field/);
});

test('validate() rejects a slug that collides with a DIFFERENT entry\'s id', () => {
  // entry1's slug ("alpha-x") does not collide with anything, so the
  // per-entry loop passes clean; entry2's slug ("alpha") is a fresh slug
  // too (not a duplicate of entry1's slug), but it equals entry1's id.
  // Only the post-loop cross-check catches this.
  const entries = [
    validTest({ id: 'alpha', slug: 'alpha-x' }),
    validTest({ id: 'beta', slug: 'alpha' })
  ];
  assert.throws(() => validate(entries), /slug "alpha" collides with another test id/);
});

test('validate() accepts the real TESTS array', () => {
  assert.equal(validate(TESTS), true);
});

for (const t of TESTS) {
  test('manifest entry "' + t.id + '" has a non-empty description and a kebab-case slug (blank-card regression guard)', () => {
    assert.ok(t.description && t.description.trim().length > 0, t.id + ': description must not be empty');
    assert.match(t.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, t.id + ': slug must be kebab-case');
  });
}
