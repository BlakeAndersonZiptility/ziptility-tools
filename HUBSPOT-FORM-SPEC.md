# HubSpot form to create: Utility Health Report Card

The report card is built and will submit as soon as this form exists. It is
the one thing standing between the tool and a dataset.

**Why this is not already done:** creating a form is a write to a shared
system, which is a draft-then-Blake decision, not something to do quietly.

**What to do:** create the form below in HubSpot portal `4938013`, then put
its GUID into `HUBSPOT.formId` in `src/reportcard/config.js` and cut a
release. Nothing else changes. Until then the tool works completely and
sends nothing.

**Do not reuse the calculator's form** (`d00fc6e5-a341-4e43-b612-45e0b62dde30`).
Different purpose, different fields, and survey responses would land in a
formula-sheet lead list.

---

## Form

- **Name:** Utility Health Report Card submission
- **Type:** non-marketing / raw form submission. This is a survey response,
  not a lead capture, and most submissions will have no email at all.
- **Follow-up email:** off by default. See the note below if you want the
  tool to promise one.
- **Required fields:** NONE. Every field is optional by design. Ruling R14
  makes this tool ungated: a required field here would put a gate in front
  of a score, and the tool already shows the full report to anyone who
  skips the block entirely.

## Fields

| Field name | Type | Notes |
|---|---|---|
| `email` | email | **Optional.** Most rows will be blank. Present only if the reader chose to give it. |
| `rc_overall_grade` | single-line text | A, B, C, D or F. The descriptive composite. |
| `rc_practical_grade` | single-line text | The grade after the red-line cap. Equals the composite unless capped. |
| `rc_practical_capped` | single-line text | `yes` / `no`. True when 2+ red-line dimensions graded F. |
| `rc_leg_t` | single-line text | Technical leg grade. |
| `rc_leg_m` | single-line text | Managerial leg grade. |
| `rc_leg_f` | single-line text | Financial leg grade. |
| `rc_redline_count` | number | How many of the seven red-line dimensions came back F. |
| `rc_redline_ids` | single-line text | Comma-separated, e.g. `T5,F1`. Which ones. |
| `rc_answered` | number | Of 23. Lets you separate complete responses from partial ones. |
| `rc_complete` | single-line text | `yes` / `no`. |
| `rc_connections` | single-line text | Size band, e.g. `1,000 to 3,300`. |
| `rc_employees` | single-line text | Staff band. |
| `rc_revenue_band` | single-line text | Revenue band. |
| `rc_system_type` | single-line text | Water / Wastewater / Both. |
| `rc_grades_json` | multi-line text | All 23 dimension grades as JSON, e.g. `{"T1":"C","T2":"B",...}`. |

**Why both summaries and a JSON blob.** The summary fields are what you can
group, filter and chart inside HubSpot without exporting anything: average
grade by system size, how many small systems fail on reserves, which
red-line dimension fails most. The blob keeps all 23 answers so a question
nobody has thought to ask yet is still answerable from data already
collected. Recreating a dropped dimension later is impossible; carrying one
extra text field is free.

**Bands, not raw numbers,** on size, staff and revenue. People guess at
these anyway, and bands make responses comparable instead of giving false
precision. The connection bands are cut around Ziptility's ICP, so the
detail sits where the customers are.

## If you want to promise "we will email you a copy"

Right now the tool does **not** promise that, deliberately. Nothing in the
bundle or in HubSpot mails anyone a report, so the email field says only
that it lets us reach them, and points out the report is on the next screen
and printable from there.

To make the stronger promise you need a HubSpot workflow that fires on this
form and sends something back. Once that exists, the email helper text in
`src/reportcard/ui/profile.js` should change in the same commit. Until then
the current wording is the true one, and shipping the promise first is how
a tool whose whole pitch is honesty loses an operator on the last screen.

## What the data is worth

Intake is blind: while answering, a respondent sees only the five
descriptions, with no letters, no ordinal words, no rank colours and in a
shuffled order (Blake ruling 2026-07-29). That is what makes these
responses worth analysing rather than just counting. A visible A-to-F
ladder invites people to shade upward, and self-assessments that let you
see the good answer measure what respondents want to be true.

Two caveats to keep attached to any analysis:
1. **Self-selected sample.** People who seek out a utility health
   assessment are not a random sample of small systems. It is a picture of
   the systems that came looking, not of the sector.
2. **Self-reported.** Blind intake removes the positional cue for shading
   upward; it cannot remove a respondent who does not know their own answer.

## Privacy

The landing screen tells the reader what happens to their answers. If this
form's behaviour ever changes, that copy changes with it. The current
promise is what the tool actually does, and it needs to stay that way.
