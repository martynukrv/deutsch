# Ship lesson: greetings and polite conversation

The ship remains lesson 1 of a single nine-lesson map, named “Вирушаємо у подорож”. It now contains two independently replayable parts with six cards each. Part 1 uses the original six greetings/goodbyes. Part 2 teaches Danke, Bitte, Ja, Nein, Wie geht’s, Gut danke. Each part has six unscored listening tasks and eight contextual assessment tasks; seven correct passes a part. Part 1 continues to part 2, then to the shore. Both parts are accessible through the lesson’s part navigation. Progress is displayed as 0/2, 1/2 or 2/2 on the map.

Bitte is taught in two distinct situations: please in a request, and you’re welcome in reply to Danke. Fox passes the map, helps pack equipment and asks how the learner is. Existing whole original recordings and approved greeting/grammar pictures are reused. No generated audio, composite recording or new artwork was introduced. Ja/nein map to their canonical lowercase dictionary entries for art and spaced repetition.

Part 1 retains deutsch16_greetings_prologue_v1. Part 2 uses deutsch16_ship_courtesy_v1. New part results have version 2; a newly earned ship seal/star requires both parts passed/perfect. Previously earned version-1 seals/stars remain valid immediately and across failed replays via a retained legacySeal flag. Opening never rewrites legacy data. Already earned island/compass/clue results are unchanged. Unfinished new courtesy work remains visible even on a previously awarded ship pin. All data stays profile-scoped.

First-island final coverage is now 30 unique tasks: 24 land tasks, 3 greetings, 3 courtesy. Both ship chapters use lessonIndex greetings with distinct chapter fields, retaining nine lesson groups. The second island stays at 18 final tasks. Prior compass and best final results are retained.

Bruno’s camp recalls Danke/Bitte. Entschuldigung is introduced later at Mia’s question square on island two with its approved picture, translation and original recording; it is excluded from the early ship cards and finals. Und dir is reserved for later. Existing authored land/village lesson cards stay unchanged.

The browser regression covers the two six-card parts, both Bitte uses, original art/audio, part-to-part navigation, combined seal/star, legacy read/replay compatibility, failed courtesy retries, 30-task final coverage, canonical activity/review, later complex vocabulary, responsive UI, English and profile isolation. CI repeats it against the published site.
