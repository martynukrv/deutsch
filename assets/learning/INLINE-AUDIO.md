# Inline German listening

A shared incremental DOM enhancer adds small SVG speaker buttons after recorded
German words/phrases in explanatory paragraphs, rules, headings and hints.
It indexes existing original whole recordings (including base AUDIO_MAP clips)
and matches the longest available phrase, preserving punctuation and textContent.
Smart/straight apostrophes resolve to the same original recording. It never
invents audio, composes words or starts playback merely by scanning text.

Buttons use the shared cancellable player, accessible UA/EN labels and native
keyboard activation. Existing interactive audio, word cards, character dialogue
controls, answer options, letter banks, editable fields and build buffers are
excluded. Character voices therefore remain isolated. Common ambiguous English
words are excluded in English prose unless explicitly marked lang=de.

Dynamic rendering is observed; scans are idempotent and never nest buttons.
Unknown/unrecorded text is preserved without an invented audio control.
Regression: .github/tests/inline-audio.cjs plus existing full browser suites.
