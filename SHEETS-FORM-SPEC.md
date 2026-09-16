# HubSpot form to create: "Email me the formula sheet PDF" (an offer, never a gate)

Blake ruling 2026-09-10 (WW-11, the email question): the formula sheets page keeps a working
print button with no email. Beside it, an OFFER: leave an address and we send the PDF link, in
the unit system the reader is using. The offer goes live only on Blake's approval, because a
form is a write to a shared system (HubSpot) and a second neutral page carrying a form was a
lane-policy call Blake made knowingly.

**What the code does today:** `src/sheets/config.js` has `hubspotFormId: ''`. While it is empty
the bundle renders no offer at all; the sheets, the strip and every print button work. Put the
form GUID there, cut a `sheets-v*` release, repoint the embed, and the offer appears below the
fourth sheet.

**Do not reuse the calculator's form** (`d00fc6e5-a341-4e43-b612-45e0b62dde30`, the
"formula & rounding sheet" lead magnet): different offer, different list, and its follow-up
email sends a different PDF.

## Form
- **Name:** Formula sheets PDF request
- **Portal:** 4938013
- **Fields posted by the bundle** (HubSpot internal names): `firstname` (optional), `email`
  (required by the bundle's own check, never by the page), `company` (optional, labelled
  "Utility or system"), `formula_sheet_system` (a NEW single-line text property, values
  `imperial` or `metric`, so the workflow can send the right PDF).
- **Follow-up:** one workflow, enrolment on this form's submission, sends the PDF link for the
  requested system. The PDFs are the page printed to PDF in each system (the page titles the
  file "Ziptility operator formula sheets (US customary)" / "(metric)"); host them as two
  HubSpot files and link the right one by `formula_sheet_system`.
- **Copy the reader sees** (in the bundle, plain operator voice): "Want the PDF in your inbox?"
  / "Printing works with no email, right from the buttons above. If you would rather have the
  PDF sent to you, in the system you are using now, leave an address and we will send the
  link." / fine print: "An offer, never a gate: nothing on this page sits behind this form. We
  send the sheet and the occasional note for small-system operators. Unsubscribe any time."
- **FORMS-REGISTER row** (ziptility/web/execution/FORMS-REGISTER.md) lands when the form exists,
  per the any-form-change-is-a-project rule.

## Not in scope
No gate, no required field beyond the bundle's email format check, no demo or pricing copy on the
page (the neutral-lane check in CI would fail the build).
