# Course recording, part 2 of 3 — 18 October 2026

User source: ElevenLabs_2026-10-18T11_02_11_Henri - Professional German_pvc_sp101_s32_sb60_v4.mp3. Original MP3 preserved byte for byte (SHA-256 3a21fb3154811dbf9bbd856ea8af642bc94649585db6227346a2ae1bad39a48f), duration 464.431 seconds.

This batch contains exactly positions 224–446 of the frozen version-1 669-entry course script. All 223 entries are phrases; their stable IDs are course80-audio-0224 through course80-audio-0446. Part 1 and all earlier audio retain their exact bindings. Part 3 remains positions 447–669 in the original order.

Full-source Whisper small German transcription is aligned to the supplied script. It omitted/merged the neighboring phrases Du warst müde / Er war krank / Wir waren in Berlin in its long-source pass. An independent Whisper medium transcription of source seconds 124–143 resolves all three correctly; its original result is retained in recheck-124-143.json. aligned-transcript.json replaces word timings only in seconds 126.5–139.5 with this regional result; full-transcript.json preserves the unaltered initial recognition evidence.

Exactly 222 distinct inter-entry pauses define 223 crops. FFmpeg silence detection uses -38 dB and a 100 ms minimum; character alignment avoids treating an internal sentence pause as an entry boundary. Crops retain up to 80 ms before and 120 ms after speech, reduced to half the available pause when needed so adjacent clips never overlap. The final speech ends at 464.171 seconds. Clips are mono 44.1 kHz, 128 kbit/s MP3.

Every cropped file is independently transcribed in German without an expected-text prompt. Case, punctuation, word spacing and equivalent spoken numeric notation are normalized for comparison. The manifest retains both aligned and isolated recognition text, source boundaries, MP3 duration and SHA-256. These are automated recognition and technical checks, not a claim of human listening to every clip.

scripts/import_voice.py validates source hash, exact count/order, timestamps, types and every packaged MP3 hash before importing. The 676 existing bindings remain unchanged, with 223 additions for 899 exact recorded bindings. The frozen 669-entry script stays unchanged; the runtime pending-audio audit is refreshed separately and retains the original IDs for part 3.
