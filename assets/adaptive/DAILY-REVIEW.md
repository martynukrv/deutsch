# Five-minute island review

The compact card above either island map launches up to twelve tasks from both islands. Five minutes is an estimate, never a countdown. No new words, actor recordings or microphone permissions are needed.

The pure planner only uses existing adaptive records for observed translation, German choices, listening and writing skills (at least one actual correct/wrong answer). Skips alone do not qualify. Legacy records without skills enrol recognition only. Due skills take priority, then recent/overall weak skills, then familiar material. Random tie-breaking and task order; one task per phrase before a second, at most two skills per phrase. Small histories yield shorter sessions. Source data is not mutated by planning.

Tasks reuse the original exercise UI, original audio, feedback/auto-next and scheduling engine. Answers update skill schedules and daily activity immediately. No lesson mode/journey is attached, so training eligibility, exam grades, seals and mastery awards are untouched. Leaving cancels the run; no completion is written. Duplicate answers are locked by the existing engine.

Completed sessions store totals/correct/skipped in profile-scoped `deutsch16_daily_islands_v1` (last sixty runs). Calendar days use the learner's local date. Optional repair runs contain only failed/skipped question+skill pairs and do not inflate today's completed main sessions. No timer/unfinished answer is graded. Summary audio uses exact existing phrase bindings.

The previous bottom-of-map review shortcut is replaced; dictionary spaced review remains available separately. New learners see an explanation and disabled button until they practise a skill. English/ Ukrainian labels follow the existing app language.

Tests: `.github/tests/daily-islands-unit.cjs`, `.github/tests/daily-islands.cjs`; both CI browser pipelines run these before existing regressions.
