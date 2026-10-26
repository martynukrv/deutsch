# Map and lesson motion

`motion.css` adds low-amplitude ship bobbing, shoreline ripple overlays, next-lesson emphasis, card entrances, answer reactions and seal reveals. It reuses all original artwork. The lighthouse retains its existing earned-state light animation. Text, hit areas and map coordinates stay fixed; the ship illustration moves independently from its button/label. Continuous map animations pause outside the viewport.

The listen-and-repeat section exposes `data-phase` and `data-outcome` solely for presentation. Its sample/listening indicators and correct/wrong feedback do not affect the three audio/reply cycles or microphone timers. Shared playback marks `data-audio-playing` while its existing promise is pending; this only decorates the listening control. No new sound, playback, grading, progression or automatic navigation is introduced.

The map’s animation toggle stores `deutsch16_motion_v1` (`on`/`off`) through profileStorage. System `prefers-reduced-motion` always wins, disables the toggle and removes all learning-view animations/transitions (including existing lighthouse/compass motion). Manual off does the same. Hidden-page animations pause; map decorations use IntersectionObserver. Animation uses transforms and opacity; no requestAnimationFrame loop, animated layout properties or new art downloads are required.

Browser regression `.github/tests/motion.cjs` checks both island maps, feedback reactions, stored toggle, live OS preference changes, English and 320/390/768/1280 layouts. Existing lesson, dialogue, shadowing, audio and progress tests remain in the same pipelines.


## Character reactions and mastery awards

Welcome portraits have one 800 ms greeting tilt, success portraits a 650 ms celebration, and encourage portraits a 500 ms nod. They reuse the approved portraits; task-context portraits remain still. No blinking or articulated hand animation is simulated.

The retired clue flight and its temporary nodes have been removed. A freshly earned 100% mentor award has one small emblem animation. Replays do not repeat that grant. The collection is derived from saved best scores before animation and stays available with reduced motion. See MASTERY-AWARDS.md and .github/tests/mastery-awards.cjs.
