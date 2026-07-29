# Extraction notes — Utility Health Report Card v2.1

Source: Google Drive file `Utility_Health_Report_Card_v2.xlsx` (fileId
`1tk-_bz9LiKnlyBNEd5GpK4DPDA20syFx`), downloaded and parsed with openpyxl on 2026-07-29.
Output: `rubric.json` in this same directory.

## Sheet inventory (6 sheets, as expected)

| Sheet | Dimensions (openpyxl) | Notes |
|---|---|---|
| Dashboard | A1:F36 (36 rows × 6 cols) | Template shell — see placeholders below |
| Rubric | A1:J28 (28 rows × 10 cols) | The core rubric; parsed into `dimensions[]` |
| Citations | A1:E27 (27 rows × 5 cols) | Has its own `ID` column — matched to Rubric by ID directly, no name-matching needed |
| Methodology | A1:D34 (34 rows × 4 cols) | Prose only; content is in column A, columns B–D empty throughout |
| History | A1:H27 (27 rows × 8 cols) | 5-year tracker template; all grade cells (Year −4 … Current) are empty by design — this is a blank form for the utility to fill in, not source content |
| Action Plan Library | A1:G27 (27 rows × 7 cols) | Parsed into `actions{}` per dimension |

## Dimension count and row structure (Rubric sheet)

Rubric sheet row 2 is the header row. Rows 3, 13, 22 are section-label rows (`Technical (T) — 9
dimensions`, `Managerial (M) — 8 dimensions`, `Financial (F) — 6 dimensions`) — these carry text
in column A that is NOT a dimension ID, so the extraction script filters rows by regex `^[TMF]\d+$`
on column A to avoid miscounting these three label rows as dimensions (an initial naive pass did
count them, yielding 26 "dimensions" before the fix).

**Confirmed: exactly 23 real dimensions — 9 Technical (T1–T9), 8 Managerial (M1–M8), 6 Financial
(F1–F6).** Matches the expected shape exactly.

## Rungs (F/D/C/B/A descriptor cells)

All 23 dimensions × 5 rungs = **115 rung cells, all non-empty.** No blanks found — every dimension
has a full F, D, C, B, A descriptor. Newlines inside cells (e.g. the multi-sentence B and A rungs
on T5, M1, F2) were preserved verbatim by openpyxl's cell.value and carried through to JSON as-is.

Column J ("Current grade") on the Rubric sheet is empty for all 23 rows — this is the per-utility
fill-in column (a blank input field for whoever completes the assessment), not omitted source
content. Not included in rubric.json since it holds no template data.

## Red-line flagging — verbatim, not normalized

Rubric sheet column I is headed "Red-line?". The marking is encoded as a single bullet character
**"●" (U+25CF BLACK CIRCLE)** in the cell — present for flagged rows, `None`/blank otherwise. No
Y/Yes/TRUE/X variants were found; it's exclusively the "●" glyph.

**Exactly 7 dimensions are marked red-line:** `T5` (Operations & Maintenance Practices), `T7`
(Regulatory Compliance), `T8` (Emergency Preparedness), `M3` (Evidence-Based Decision-Making),
`M8` (Workforce / Operator Bench), `F1` (Financial Reserves), `F2` (Rate Adequacy).

This **confirms the discrepancy flagged in the task**: repo docs reportedly describe a 6-dimension
red-line set (T5, T7, T8, F1, F2, M8), but the workbook itself marks **7**, adding **M3** to that
set. `rubric.json` carries both a boolean `redLine` field and the raw `redLineRaw` value ("●" or
`null`) per dimension so downstream consumers can see the literal encoding rather than a filtered
judgment call.

## Action Plan Library — 92 transition cells

23 dimensions × 4 transitions (F→D, D→C, C→B, B→A) = **92 cells, all non-empty.** IDs on this
sheet match Rubric IDs exactly (T1–T9, M1–M8, F1–F6) — matched directly by ID, no name-fallback
needed. Header row is row 4; data rows 5–27 (23 rows), consistent with the Rubric dimension count.

**Methodology sheet row 25 says "Sheet 6 holds 22 dimensions × 4 transition cells"** — this is the
typo flagged in the task. The actual, verified row count on the Action Plan Library sheet is
**23 dimensions**, matching the Rubric sheet exactly, not 22. Preserved verbatim in
`methodology.raw` (i.e., the "22" text is carried through unedited) rather than silently corrected.

## Citations — matched by ID, not name

Citations sheet header is row 4 (`ID`, `Dimension`, `TMF leg`, `Anchor sources`, `Verification
status`); data rows 5–27 (23 rows). **The sheet has its own `ID` column**, so matching to Rubric
dimensions was done by ID directly — name-matching was not needed and was not used. All 23
Rubric dimension IDs have exactly one corresponding Citations row; no orphans either direction.

Every citation row's "Verification status" column reads the identical boilerplate: `[VERIFY all
primary citations before publication]` — none of the 23 anchor-source citations have been
independently verified yet. This is carried into `rubric.json` under each dimension's `citation`
field as the anchor-sources text only (the verification-status boilerplate itself was not
duplicated into the JSON since it's identical across all 23 rows and adds no per-dimension signal;
flagging it here instead).

## Methodology sheet — verbatim content, and the "22 dimensions" note

`methodology.raw` in rubric.json is every non-empty cell (all content lives in column A; columns
B–D are empty on every row) joined with newlines, in top-to-bottom reading order, verbatim.

Key excerpted rules (for reference — full text is in `rubric.json` → `methodology.raw`):
- Scoring — descriptive composite: dimension grades convert F=0, D=1, C=2, B=3, A=4; average
  within each TMF leg and round to the nearest letter; Overall = mean of the three leg averages.
- Scoring — diagnostic flag panel: red-line dimensions are described as "determined by the author
  during workbook calibration (Phase 2)" — the sheet's own text does NOT hard-code the red-line
  set as a fixed list; the actual current markings are the 7 "●" cells found on the Rubric sheet
  (see above).
- Practical-grade cap: 2+ red-line F's → Overall is annotated "Practical Grade: D (capped by
  diagnostic flags)" even if the descriptive composite scores higher.
- "Sheet 6 holds 22 dimensions × 4 transition cells" — confirmed typo; actual count is 23 (see
  Action Plan Library section above).

## Dashboard sheet — placeholder markers found

The Dashboard sheet is an unfilled template. Placeholder markers present verbatim:
- Row 13, all four composite-grade cells (Technical/Managerial/Financial/Overall):
  `[CALIBRATE — formula in Phase 2]`
- Row 17 (red-line diagnostic flag panel body): `[Red-line dimensions: TBD by author — Phase 2
  candidate list will populate]`
- Row 28 (personalized action plan body): `[Phase 11: LLM populates this section based on
  completed Rubric grades + Action Plan Library content + utility-specific context]`
- Rows 4–9 are labeled input fields (System name, System size, Assessment year, Completed by,
  Role, Years of experience) — all blank, awaiting per-utility entry.
- Rows 32–35 (One-rung-up table body) and the History-sheet reference on row 36 are blank/pointer
  text only — no data to extract.

None of the Dashboard content was extracted into `rubric.json` since it is 100% either a blank
input template or an unfilled `[CALIBRATE]`/`[TBD]`/`[Phase N]` placeholder — there is no
rubric content on this sheet distinct from what's already captured from Rubric/Citations/
Methodology/Action Plan Library.

## Discrepancies summary (does not match expected/prior assumptions)

1. **Red-line set is 7, not 6** — workbook marks T5, T7, T8, M3, M8, F1, F2. Prior repo docs
   reportedly said T5, T7, T8, F1, F2, M8 (6, no M3). Confirmed: the workbook adds M3.
2. **Methodology sheet literally says "22 dimensions"** in its Action Plan Library description
   (row 25) — confirmed typo; the actual, verified dimension/row count everywhere else (Rubric,
   Action Plan Library, Citations, History) is 23.
3. No other count or structural mismatches found: 23 dimensions (9T/8M/6F) exactly as expected,
   115/115 rungs populated, 92/92 action cells populated, 23/23 citations matched.

## Grade labels (verbatim from Rubric row 2)

- F: `F — Survival`
- D: `D — Existing Day-to-Day`
- C: `C — Fairly Stable`
- B: `B — Very Stable`
- A: `A — Thriving`
