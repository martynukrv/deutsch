# Spoken conversations

Fox, Karl, Benno and Greta now share `dialogue-voice.js`. Active turns have no typed field, tiles or answer choices. The partner's exact original recording plays once on entry; recognition starts only after successful playback when microphone permission is already granted. On turns where the learner initiates a question, recognition starts directly. Replay and hint audio stop recognition before playing and resume it afterwards. The learner's own recording is not automatically played back over their answer.

First-time access requires the visible microphone button and the browser's consent. The temporary getUserMedia permission stream is immediately stopped; SpeechRecognition uses de-DE with up to five alternatives. Only final results are submitted. Expected alternatives are accepted; a different recognised phrase remains ungraded until the learner confirms it. Silence, denied permissions, service errors and audio failures never record a wrong answer. Retry and pause remain available without a text fallback. Unsupported browsers receive a clear message.

Visibility changes, leaving a scene, island/mode/profile navigation and page exit abort recognition and invalidate pending playback/permission/result callbacks. Original phrase matching, hidden hints, conversation history, lesson grades, profile isolation and completion keys remain. Mic permission is browser state, never saved as learning progress.

Tests: dialogue-voice-unit.cjs covers the playback/ASR lifecycle and failures; dialogue-voice.cjs exercises first permission and recognition in the actual scene; all four conversation browser tests now deliver mocked speech results through the same public recognition callbacks used in production.
