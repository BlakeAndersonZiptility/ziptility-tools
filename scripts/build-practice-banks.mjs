#!/usr/bin/env node
/* Builds dist/practice-banks/<id>-v<bankVersion>.json from banks-src/.
   Artifacts are immutable, same rule as dist/calculator-vX.Y.Z.js: an
   existing versioned file is never overwritten, only skipped (logged).
   Usage: node scripts/build-practice-banks.mjs */
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { TESTS } from '../src/practice/manifest.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const BANKS_SRC = path.join(ROOT, 'banks-src');
const DIST_DIR = path.join(ROOT, 'dist', 'practice-banks');

mkdirSync(DIST_DIR, { recursive: true });

let failed = false;
for (const t of TESTS) {
  const srcPath = path.join(BANKS_SRC, t.id + '.json');
  if (!existsSync(srcPath)) {
    console.error('BUILD FAIL: no banks-src/' + t.id + '.json');
    failed = true;
    continue;
  }
  const outName = t.id + '-v' + t.bankVersion + '.json';
  const outPath = path.join(DIST_DIR, outName);
  if (existsSync(outPath)) {
    console.log(outName + ': exists, skipping (immutable)');
    continue;
  }
  copyFileSync(srcPath, outPath);
  console.log(outName + ': built');
}

if (failed) process.exit(1);
