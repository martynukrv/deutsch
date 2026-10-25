# Shared introductory lesson training

Greeting aboard ship and courtesy in Lina’s harbour retain their existing map
entries, six phrases, illustrations, explanations and original whole audio.
Their study screens now start the SAME adaptive task/feedback engine as land
lessons: six DE-to-translation tasks, six mixed practice tasks, six assessed
tasks (each phrase exactly once; two DE, two listening, two writing).
The courtesy practice retains Bitte as a response to Danke, in addition to
the two-meaning explanation in the intro. No new advanced phrases are added.

Shared exposure plays visible German/listening prompts; German answer choices
and typing letters remain silent. Tapping a displayed German phrase replays it.
Correct feedback plays the recording then advances after the existing two-second
pause. Wrong answers stay until Next. Leaving cancels audio and pending timers.

A pass is at least 80% (5/6); 6/6 earns mastery. Existing profile keys remain
unchanged: deutsch16_greetings_prologue_v1 and deutsch16_ship_courtesy_v1.
The legacy best/last out-of-eight fields stay on their old normalized scale
for route/star compatibility. New v3 results explicitly store lastCorrect,
assessmentCount=6 and lastPercent. Earned passes and maximum best are retained.
Reading old results never rewrites or migrates them. Land lesson arrays and
island final coverage (27/21 tasks) are unchanged. Camp remains a two-question
ungraded review; its correct feedback also uses the shared pacing.

Regression: .github/tests/greetings.cjs covers legacy results, route geometry,
18-task content/assessment coverage, auto audio, text replay, audio-end pacing,
held errors, duplicate attempts, cancellation, results, replay and profiles.
