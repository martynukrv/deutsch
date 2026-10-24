# Greeting prologue

The first island begins with “Meeting on the shore”, using the existing six greeting illustrations and whole original recordings. There are six unscored listening tasks, followed by eight context/reply tasks; seven correct answers pass (at least 80%). The two dialogue tasks recycle Hallo and Tschüss. Prompts distinguish a requested neutral/polite expression from a casual one, rather than claiming casual greetings are wrong at a particular time.

Completion is stored through profileStorage in deutsch16_greetings_prologue_v1. Passed and best (out of eight) survive weaker replays. No write occurs merely on opening. Existing journey keys, eight indices, clues, stage/card data and 24/18-task finals are unchanged. New learners’ main continue action starts with the prologue. Existing learners keep their existing continue destination and can open the prominent prologue card any time. No gating is added.

Bruno’s camp offers an optional two-question contrast of Guten Abend and Gute Nacht, using the existing night illustration and whole recording. It returns to mission 2 and does not write any results. Second-island lesson intros and results reuse greeting/goodbye audio without changing exercise material or final coverage. All new UI has Ukrainian/English strings. The same greeting vocabulary remains available in the dictionary and pronunciation section.

Browser regression: .github/tests/greetings.cjs runs locally in CI and against the published site. It covers existing whole-recording availability, loaded images, mobile/desktop overflow, wrong and correct attempts, duplicate answers, retention, reload, original journey compatibility, camp return, village bridges, English and separate learner profiles.
