/* Subject-area codes to reader-facing labels.

   ONE source, because there are now two surfaces that name these to the
   same reader: the chip beside a live question (quiz-engine.js) and the
   subject-area table on the discipline page (scripts/build-page-content.mjs,
   the Q-12 split). Two copies drifted apart the moment they existed: the
   page called SAMP "Sampling and lab" while the test chip called it
   "Sampling", so the same 14 questions had two names on one screen.

   `Multiple` is not a bank domain. It is the engine's fallback for a
   mixed-topic item and is never counted in a breakdown. */
export const DOMAIN_LABELS = {
  MATH: 'Operator math',
  CHEM: 'Chemistry',
  MICRO: 'Microbiology',
  REGS: 'Regulations',
  SAMP: 'Sampling',
  SAFE: 'Safety',
  PROC: 'Process control',
  EQIP: 'Equipment',
  ADMIN: 'Administration',
  Multiple: 'Mixed topics'
};
