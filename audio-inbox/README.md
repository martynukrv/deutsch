# Verified voice packages

Each ZIP contains individual MP3s with a matching JSON manifest. Only batches whose count, source order, transcript checks, original hash and clip hashes have passed are marked verified. User authorization for the Henri batch was conditional on exact count/order verification, and both passed for all 409 supplied entries.

Run python3 scripts/import_voice.py. It validates all package data before writing clips, preserves the packaged MP3 bytes, and generates content-addressed audio filenames plus assets/vocabulary/recorded-audio.js. CI imports and browser-tests recordings before publication and tests all clips again on the published site.
