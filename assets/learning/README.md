# Learning catalog and spaced repetition

`word-catalog.js` assigns 282 dictionary entries permanent IDs. Keep an existing ID when changing spelling, translation or category, and update the matching fields. New words get new IDs; never regenerate IDs from reordered category positions. Runtime matching uses German + Ukrainian meaning, so homonyms remain separate.

`review.js` uses profileStorage exclusively. Version 1 is a simple explicit scheduler, not FSRS: separate cards for recognition, recall, listening, writing and speaking; success advances through 1/3/7/14/30/60/120/180 calendar days in the device timezone, failure restarts with a ten-minute retry. Early successful practice cannot extend an existing future interval unless correcting a failure. Calendar arithmetic handles local day boundaries. Missed days do not delete due cards.

Every vocabulary training answer updates the appropriate card. A typing fallback records writing rather than pronunciation. A mismatched speech transcript requires explicit confirmation or another attempt before being graded. Per-card lifetime totals and the latest 5,000 answer events are stored. Existing aggregate statistics remain intact. On first use, previously practised words enrol only in recognition, due now; no proficiency or historical dates are inferred.

The home plan takes at most 20 due skill cards per session and retains the remainder. New-word sessions default to five new words per local day, configurable 0/5/10/15/20/30. Manual dictionary practice is unlimited but newly attempted words count toward today's introductions. Additional skills for previously introduced words do not consume the new-word budget. Each runtime item carries its original category for correct distractors across mixed-category sessions.

This first version covers dictionary words. Lesson phrase repetition and richer lesson progression are subsequent work; current lesson exercises remain available. Profiles and schedules are local to the browser and not cloud-synced.
