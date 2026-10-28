# Integrated Benno market situation

Village lesson 3 (authored index 1, haben) keeps its six cards, original theory, five-stage training, randomized 18-question test, shadowing practice and 100% mastery award. The new optional situation is part of that lesson. It has a top Talk with Benno action, a visible grammar/Bitte explanation and a collapsed model conversation. Training completion also offers the situation. A passed exam offers it as the primary next action until completed, with an explicit Next lesson · Mia alternative. It never gates Mia or the island final.

The learner types six replies as Oleksii: greeting, hunger/thirst/time answers, thanks for water, goodbye. The three middle questions are shuffled; repeating a completed conversation avoids its last order. The question pattern (Du hast… → Hast du…?) is explained without introducing new noun cases. Optional replies without Ja are accepted. Bitte when handing water explicitly means Here you are. Existing approved merchant portraits and water artwork are reused.

Guided mode exposes the first two contextual hints, then hides subsequent hints. Independent mode starts with all hints hidden. Learners can always open them; three distinct wrong attempts expose help automatically. Blank input and repeated unchanged submissions do not count as attempts. Correct replies lock input, optionally play the exact recorded learner line, then advance after the existing two-second style of pause; Next permits an immediate manual advance. Incorrect replies stay for correction.

## Progress and cancellation

Only actual distinct attempts count towards daily activity. The scene does not modify lesson grades, training unlocks, SRS schedules, mastery badges, lighthouse state or Karl's conversation. All six successful replies save profile-scoped deutsch16_benno_conversation_v1 completion, last-run hints/errors/order, and the best number of first-try replies without hints. The score is descriptive conversation feedback, not a pronunciation percentage or a lesson grade.

Completion leads to the lesson test if already eligible, otherwise the complete lesson training. Navigation, island changes, mode changes and lesson starts cancel pending audio and advancement. Hidden tabs stop audio/automatic advancement; the visible Next control lets the user continue deliberately. Detached DOM/generation guards prevent a stale recording or timer from returning to an old conversation.

## Recording status — deliberately explicit

Three exact original Dylan Carter recordings (hello, thanks, goodbye) are reused from Karl's existing learner role. Benno's six lines and Oleksii's three new haben replies await user-supplied recordings. Benno's voice is not yet selected. Missing audio has no fabricated path, neutral-role substitute, word concatenation or browser TTS. The scene is fully playable in text now. The full-dialogue listen control becomes available only when every one of the twelve role-bound lines is present.

Scripts and frozen role/phrase IDs: audio/recording/benno-dialogue-v1.txt/.json. Copy-ready German: benno-v1-benno.txt and benno-v1-oleksii-new.txt. benno-audio.js is the explicit runtime binding point for validated future whole clips. Cast metadata keeps Helmut as Karl and Dylan Carter as Oleksii; Benno remains pending. No audio was generated in this change.

## Validation

benno-unit.cjs checks shuffled plans, accepted/rejected semantic variants, exact role-bound clip availability and replay order. benno-conversation.cjs covers integration, guided/independent progression, original learner voice, absent-voice honesty, answer dedupe, auto-next, correction help, grade/test/SRS isolation, optional post-test Mia route, pause/navigation cancellation, replay, reload, English, profiles and responsive UI. Existing tests for both islands, Karl, mastery, original recordings, shadowing and lighthouse remain enabled.
