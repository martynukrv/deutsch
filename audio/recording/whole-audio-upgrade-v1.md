# Whole-utterance voice upgrade, frozen queue v1

The audit distinguishes one complete recording from a playlist of individual word recordings and browser SpeechSynthesis fallback. Prior course coverage counted both whole and composed recordings as available audio; it did not claim one complete recording per phrase.

Scope: all 80 course lessons, contexts/bonuses/lexicon, first-lesson reading samples, dictionary categories, verb forms, full legacy exercise pools, transformation base sentences, individual playable choice tokens and actual legacy explanation audio buttons. Arbitrary user-entered text and transient playback/network failures are outside this finite authored-material inventory.

Result on 18 October 2026: 1449 whole-recorded texts, 123 composed texts, 24 browser-synthesized texts; 1596 distinct audio keys. All 1449 referenced MP3 files exist and decode successfully. The 24 synthesized items include old-program individual choice words such as articles, noun heads without their recorded articles, and several short phrases/forms. Current course material has recorded routes, but some still concatenate individual files.

whole-audio-upgrade-v1.txt is the only reading script: 147 lines in exact order, each ending [pause], 3390 Unicode characters. First 24 lines replace browser synthesis; the remaining 123 replace concatenated recordings. Each line must be read as one complete natural utterance. whole-audio-upgrade-v1.json preserves stable IDs, order, previous route and source references. Do not overwrite this queue after recording begins; future additions need a new version.

A truncated explanation audio button that previously read only “machst du?” is corrected to include question words, so complete questions are audited and recorded. No existing audio is disabled before the replacement recordings are received, checked and imported.

Reproduce inventory and decoding checks: NODE_PATH=... node scripts/audit_all_audio.cjs --decode. The all-audio-audit-20261018.json inventory is a point-in-time report, separate from the frozen reading queue. After import, rerun the audit to verify zero composed and zero synthesized routes for this authored inventory. The normal playback resolver already prioritizes exact full-text recordings over assembled words, so the new bindings replace the assembled routes directly.

Import on 18 October 2026: user supplied the complete 147-entry Henri recording. Batch henri-whole-upgrade-20261018 preserves the original, frozen queue, independent full-source and isolated transcriptions, silence boundaries and extra short-form recognition checks. Each replacement is a continuous excerpt of that original. Current route counts and file-decoding results are in all-audio-audit-20261018.json; the frozen queue above remains unchanged.
