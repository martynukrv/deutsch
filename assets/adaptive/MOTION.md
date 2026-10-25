# Map and lesson motion

`motion.css` adds low-amplitude ship bobbing, shoreline ripple overlays, next-lesson emphasis, card entrances, answer reactions and seal reveals. It reuses all original artwork. The lighthouse retains its existing earned-state light animation. Text, hit areas and map coordinates stay fixed; the ship illustration moves independently from its button/label. Continuous map animations pause outside the viewport.

The listen-and-repeat section exposes `data-phase` and `data-outcome` solely for presentation. Its sample/listening indicators and correct/wrong feedback do not affect the three audio/reply cycles or microphone timers. Shared playback marks `data-audio-playing` while its existing promise is pending; this only decorates the listening control. No new sound, playback, grading, progression or automatic navigation is introduced.

The map’s animation toggle stores `deutsch16_motion_v1` (`on`/`off`) through profileStorage. System `prefers-reduced-motion` always wins, disables the toggle and removes all learning-view animations/transitions (including existing lighthouse/compass motion). Manual off does the same. Hidden-page animations pause; map decorations use IntersectionObserver. Animation uses transforms and opacity; no requestAnimationFrame loop, animated layout properties or new art downloads are required.

Browser regression `.github/tests/motion.cjs` checks both island maps, feedback reactions, stored toggle, live OS preference changes, English and 320/390/768/1280 layouts. Existing lesson, dialogue, shadowing, audio and progress tests remain in the same pipelines.


## Character reactions and clue collection

Welcome portraits have a single 800 ms greeting tilt, success portraits a 650 ms celebration, and encourage portraits a 500 ms nod. All reuse the exact existing portraits. Task-context portraits remain still; no idle loop runs while the learner answers. No blinking or articulated hand animation is simulated on the raster artwork.

A passed first-island land lesson shows its original clue plus an eight-slot collection. Freshness is derived from the existing prior passed flag, so replaying a passed lesson cannot create a new clue. The reward is already saved before any animation. The motion layer uses a decorative, aria-hidden numbered chip to fly from the clue to its collection slot only when both are visible. One Web Animation is cancelled on navigation, hidden pages or disabling motion, and removes its temporary DOM. There is no blocking timer, scrolling, reward delay or additional grade/storage mutation. The next map render briefly emphasizes the newly earned fragment once. The collection remains fully visible with motion disabled. Ship greetings do not award clue fragments; second-island lessons retain their existing seals instead of acquiring a new clue system.

`.github/tests/character-clues.cjs` covers all land-lesson portraits on both islands, still task portraits, fresh and replayed awards, failed replay retention, animation cleanup, reduced motion and collection persistence. It runs locally and against the published site in CI.
