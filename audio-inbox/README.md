# Verified voice packages

Each ZIP contains individual MP3s with a matching JSON manifest. Only batches whose count, source order, transcript checks, original hash and clip hashes have passed are marked verified. User authorization for the Henri batch was conditional on exact count/order verification, and both passed for all 409 supplied entries.

Run python3 scripts/import_voice.py. It validates all package data before writing clips, preserves the packaged MP3 bytes, and generates content-addressed audio filenames plus assets/vocabulary/recorded-audio.js. CI imports and browser-tests recordings before publication and tests all clips again on the published site.

The henri-lessons-20261017 batch adds 44 verified full lesson phrases (42 exact-full and 2 exact-isolated checks), bringing the generated recording map to 453 distinct bindings. The completed source script remains in audio/recording/lesson-expansion-20261017.txt.

The henri-course-part1-20261018 batch adds the first 223 entries of the frozen 669-entry course script: 12 whole reading texts and 211 phrases/proverbs. It preserves the 453 existing recordings, for 676 exact recorded bindings. The other two script parts retain their original order and IDs.
