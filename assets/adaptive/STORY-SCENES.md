# Short adventure scenes

The existing post-compass departure flow (including optional Fox rehearsal) now calls a four-second voyage scene before selecting island two. It reuses the two map originals, the original ship and compass layers. Direct island-picker navigation remains direct.

A successful island-two final offers “Засвітити маяк” and plays a four-second beacon/resident celebration before showing the map. The earned lighthouse map also offers a replay button. Existing grades, key, light and best-score retention are saved by the final before the scene and never modified by the scene. Failed finals do not trigger a celebration.

Scenes use a native modal dialog with initial focus on Skip, keyboard focus containment and Escape as skip. Skip or the deadline invokes the continuation exactly once; tab/mode/island navigation cancels the scene without invoking stale continuations. The deadline pauses while the page is hidden, matching paused CSS animation. Manual motion off and system reduced motion bypass the scenes immediately. A live reduced-motion change completes the open scene. No new audio, synthesized voice or generated artwork is introduced.

The standalone module exposes `DEUTSCH_STORY.play({type,t,done})` and `cancel()`. Lesson `cancel()` closes it; scenes never delay recording a score. `.github/tests/story-scenes.cjs` covers both scenes, original image decoding, modal controls, skip/automatic continuation, navigation cancellation, responsive layouts, reduced motion, English and reward retention. Existing Fox, expedition and Karl regressions explicitly skip the decorative scene when testing the underlying lesson routes.
