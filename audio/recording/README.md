# Pending voice recording — 17 October 2026

queue.txt is the complete recording script: every line ends with [pause]. queue-additions.txt contains only items after the previously supplied first 73 lines. Keep that exact order when recording. queue.json supplies stable rq001… identifiers, exact transcripts and types for later audio splitting/binding.

409 distinct requested clips: 67 dictionary words/expressions, 86 conjugated single words and 256 full pronoun–verb phrases without their own clip. The initial 73 entries retain their previous order. No existing complete phrase is requested again; repeated phrases shared by plural sie and formal Sie require one recording only. Some requested full phrases can currently be composed from single-word recordings; a whole-phrase recording will improve their natural delivery. Others currently require browser synthesis. No new audio has been added yet.

Training covers all 38 dictionary verbs × 9 personal-pronoun meanings = 342 tasks (304 distinct German phrases). The first beginner lesson retains five verbs, with all nine pronouns. The verbs lesson offers the whole pool or any individual verb with all nine combinations. It uses explicit six-person present-tense forms, including stem changes and modal verbs.

Regenerate the queue after integrating recordings with `node scripts/build_recording_queue.cjs`. Existing punctuation-bearing audio keys are normalized at runtime, restoring previously recorded greetings.
