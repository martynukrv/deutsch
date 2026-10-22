# Local learner profiles

`profiles.js` loads before the app, creates a stable profile ID, and exposes `profileStorage` with the localStorage get/set/remove interface. All learning progress and practice settings must use this adapter. The profile registry and active selection alone use raw localStorage.

Existing deutsch16 storage keys are copied into the first profile before publishing its registry. Legacy keys remain intact as a backup; they are never used by another profile. Migration snapshots the key list before writing and runs only when no valid registry exists.

Switching saves the active ID and reloads the page, discarding microphone callbacks, pending session timers, and in-memory quiz state. Each page retains its original session ID for storage writes until reload. The active learner is pinned in sessionStorage per tab; switching another tab cannot change this tab’s learner. Registry updates refresh names, and deletion reloads tabs using the removed learner. Deleted IDs cannot accept stale writes. Confirmed deletion removes only that profile’s namespace; the last profile cannot be deleted. Profile names are rendered as text.

These are local, shared-device learner profiles, not authenticated accounts or cloud sync. Clearing browser data removes profiles. Future spaced-repetition state must use profileStorage as well.
