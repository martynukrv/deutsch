# Ship greetings lesson

Greetings are lesson 1 in the first island’s single ordered map route, aboard ship before landing. The ship uses the approved das Schiff artwork in assets/illustrations/places/exp_47.png; no original art was changed. Lessons on land are displayed as 2–9. The map, island picker and passport all show nine lessons/seals. There is no separate prologue card. Ship completion earns a seal; 8/8 earns its star. Continue opens the first unfinished route lesson, while all lesson pins stay open.

The six greeting illustrations and whole original recordings are reused. Six unscored listening tasks precede eight contextual tasks, including a mini dialogue; seven correct answers pass. The old profile-scoped deutsch16_greetings_prologue_v1 key is retained so previous greeting completion appears immediately as the ship seal. Its best score is out of eight. Old on-land result indices 0–7 retain their original meaning, including eight clue fragments; no saved results are renumbered or rewritten. All nine display items are available through DEUTSCH_JOURNEY.route(). The greetings route item opens through DEUTSCH_JOURNEY.open('greetings').

The first island’s final now includes three unique greeting tasks alongside three from each of the eight land lessons: 27 tasks total. Existing earned compass and best results remain retained. The second island stays at six lessons and 18 final tasks. No gate is added.

Bruno’s camp retains the optional Guten Abend / Gute Nacht review, returning to the same camp lesson without changing mission results. Village greeting bridges remain. Real answers count once toward activity and spaced repetition through canonical vocabulary IDs. Opening a lesson never counts as an answer. All text supports Ukrainian and English.

.github/tests/greetings.cjs verifies nine route nodes ordered ship-first, mobile/desktop layout, original progress compatibility, counters/passport, ship star/retention/reload, unique final greeting coverage, original audio and images, activity/review, camp, village, localization and profile isolation. It runs both in CI and on the published site.
