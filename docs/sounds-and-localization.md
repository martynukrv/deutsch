# Grammar course and sounds

The public course now contains 79 sequential grammar lessons. The previous `sounds-greetings` foundation lives in the separate Sounds section, together with 22 pronunciation topics, word listening, dictation, first greetings and listening practice using phrases from any selected grammar lesson.

Permanent lesson, phrase and vocabulary IDs have not changed. Published lesson numbers decrease by one; `authoringNumber` retains the number used by the authored source files. `scripts/split_sound_section.py` applies this separation at build time without modifying the authoring plan or reassigning progress. The original foundation remains in `soundFoundation` for provenance and stable vocabulary links. Its previous score is shown in Sounds; it is not counted as a completed grammar lesson.

Sounds stores separate per-profile results under `deutsch16_sounds_v1`. Existing vocabulary and phrase answers feed the same skill-specific review scheduler. Leaving the section cancels its active practice. Listening options have moved out of the grammar lesson exercise selector; word and phrase playback buttons remain available throughout the app.

## Localization

- `assets/learning/sounds-data.js`: stable topic IDs, German spellings, IPA targets and German recording references. These do not depend on the learner's native language.
- `assets/i18n/sounds.js`: Ukrainian and English interface strings, articulatory explanations and greeting translations. Add a locale dictionary keyed by the document language; missing keys fall back to Ukrainian.
- `assets/learning/sounds-player.js`: shared renderer and exercises. No exercises ask the learner to identify German sounds using Ukrainian or English letter approximations.
- IPA denotes the target sound inside a whole-word recording, not a newly recorded isolated phoneme. The interface states this explicitly. Articulatory guidance describes lips and tongue instead of equating German sounds with native-language letters. Letter-to-sound notes apply to the stated examples and do not claim there are no exceptions.
- Grammar phrase listening asks the learner to select the German phrase heard. It does not require Ukrainian translations; the canonical Ukrainian meaning remains an internal stable identifier for review scheduling.

Sources used to check notation and introductory reading patterns:

- https://www.internationalphoneticassociation.org/content/ipa-chart
- https://www.dw.com/downloads/26294179/lektion1-learner-pronunciation.pdf

The course search starts collapsed behind an accessible magnifier next to the catalog heading. Opening moves focus to the input; Escape clears the filter, restores expanded modules and returns focus to the button.

Foundation-only greeting phrases are excluded from grammar checkpoints. The historical course-80 recording queue remains unchanged; the current source fingerprint and recording coverage are versioned separately in course-79-missing.json/.txt.
