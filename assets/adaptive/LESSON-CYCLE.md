# Island lesson cycle

All 16 route lessons across both islands expose separate Training and Test
buttons. New tests unlock after completing that lesson’s training; existing
passed lesson records retain immediate test access. Training completion uses
profile-scoped deutsch16_island_training_v1 keyed by island plus the stable
lesson index or greetings/courtesy entry ID. Reading existing results does not
rewrite them. No lesson/final IDs or earned rewards are migrated.

Training: all authored phrases in five ordered stages (ua, de, listen, write,
speak), independently shuffled within each stage. Six phrases yield 30 initial
tasks. After all five stages, unsuccessful phrase/type pairs repeat in shuffled
correction rounds until corrected or three unsuccessful attempts total. Explicit
skips remain unresolved; unsupported or deliberately skipped microphone stages
are recorded as skipped and are not forced into correction loops. Training
never awards a graded lesson pass or changes a saved test result.

A separate summary offers Take test, Repeat training and map navigation. Karl’s
recorded model and independent conversation remain in his lesson; completing
that conversation now leads to the lesson test rather than another island final.

Test: three distinct types per phrase, sampled from translation both ways,
listening and writing; mode totals are balanced and no phrase appears in adjacent
questions. Six phrases yield 18 tasks. Speaking is excluded from grading. The
80% threshold, best-result retention, seals and route/clue rewards remain.

The score and attempt counter are saved before optional error corrections.
Corrections use the same three-attempt cap and never rewrite that score.
A better score requires a newly randomized test. Island-wide final challenges
remain at 27/21 tasks with their existing compass/key/light rewards.

Correct-only audio-end plus two-second advancement and held errors continue
through the shared player. Navigation cancels pending audio/timers. Original
recordings, illustrations, profile isolation and canonical review IDs remain.

Validation: lesson-cycle-unit.cjs, island-lessons.cjs (all 16 real UI paths),
updated greeting, village, resident, market, expedition, Karl/Fox and journey
regression suites; published-site CI runs the same checks.
