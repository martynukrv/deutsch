# Deutsch 16 — development handoff, 24 October 2026

The second island was prepared in the previous session but never published. Previous main: 15a9715ee914d647f86cb2a85780e7a51b23e000. Recovered code, original imagegen sources and crop plans. Existing first-island artwork and progress are preserved.

App: https://martynukrv.github.io/deutsch/; source: martynukrv/deutsch, main.

Learning contains two freely selectable islands. First: eight lessons and the lost compass. Second: Meet the island residents, six lessons (sein, haben, questions, nicht/kein, introductions, dialogue replies), six cards per lesson and a separate six-item assessment. Village has 30 distinct phrase scenes, whole recorded phrases, a top-down map and an 18-phrase final covering all six lessons without duplicates. At least 80% earns the lighthouse key; 100% earns the explorer seal. Dialogue replies use Oleksii as a fictional learner persona.

Progress remains isolated by profile. First island keeps deutsch16_journey_v1 unchanged; second uses deutsch16_journey_village_v1; selection uses deutsch16_journey_selected_v1. Failed retries retain passed status and best scores. Shared discoveries display both artifacts.

Preserve existing illustrations and original voice recordings. Use whole recordings, without TTS or concatenated clips. Follow AGENTS.md for art style and workflow. Village originals and crop rectangles: art-sources/village-20261023/.

Verification: model checks cover 2,000 final queues, lesson scope, storage and retained rewards. .github/tests/village.cjs covers lesson/final completion, whole audio/native art, dialogue audio, 320–1280px, reload, English and profile isolation. Both CI workflows run it; Import Original Artwork also runs it against deployed Pages. native-scenes.cjs now checks 84 scenes (54 existing + 30 village). Keep existing smoke/import/audio checks and inspect post-deployment results before declaring completion.
