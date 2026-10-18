# Course recording, part 3 of 3 — 18 October 2026

User source: ElevenLabs_2026-10-18T11_18_29_Henri - Professional German_pvc_sp101_s32_sb60_v4.mp3. Original MP3 preserved byte for byte (SHA-256 f3d41d0ab90a78d23ffa51aae9b88a6d1240000494d0f1ec133ba1002c5a5249), duration 224.992625 seconds.

Exactly 223 entries correspond to frozen script positions 447–669: 8 phrases followed by 215 lexical entries. Stable IDs are course80-audio-0447 through course80-audio-0669. The three queues concatenate exactly to the original 669-entry version-1 script, which remains unchanged.

Full-source Whisper small German transcription and word timings are retained unchanged in full-transcript.json. Regional Whisper medium checks resolve Hunger and the article sequence, plus the omitted Kopfschmerzen / wehtun / Fieber sequence. aligned-transcript.json substitutes regional word timings only in source seconds 20.8–39.7 and 193.8–200.3; both original and regional evidence are retained.

222 distinct inter-entry pauses define 223 non-overlapping crops. Pauses between short words can be very brief: FFmpeg detection uses -38 dB and a 60 ms minimum, with character alignment to distinguish internal pauses. Crops retain up to 80 ms before and 120 ms after speech; padding is reduced to half the available gap where needed. The final speech ends at 224.765 seconds. Output MP3s are mono 44.1 kHz at 128 kbit/s.

Each cropped file has an independent German Whisper small recognition result. Additional Whisper medium isolated and surrounding-context checks address ambiguous short words (including Mia, legen and zeigen). All evidence is preserved. Verification statuses: 198 exact-isolated, 10 exact-medium, 13 exact-full, 2 homophone. man/Mann and dass/das have identical German pronunciation; the supplied script fixes the written binding. Case, punctuation and word spacing are normalized; no expected-text prompt was supplied. Automated recognition/technical checks do not constitute human listening to every clip or independent pedagogical proofreading.

The manifest records source boundaries, durations, MP3 SHA-256, both aligned/isolated recognition texts and extra checks where used. scripts/import_voice.py validates the complete package and original source hash before importing. Lexical clips retain a strict 5-second maximum with a matching queue type; existing short batches retain the same bound.

All 899 earlier bindings remain unchanged. The final map has 1122 exact recordings; the runtime course audit covers 893 of 893 texts with zero pending entries. No profile, progress or phrase IDs are changed.
