# Glute Growth Tracker

A 16-week glute growth and calisthenics tracker that installs on your phone's home screen and works offline.

All data (workouts, measurements, photos) is stored on the phone that uses it. Nothing is sent anywhere. Use **Settings > Backup file** every few weeks.

## Updating the app
1. Upload the changed files to this repository.
2. In `sw.js`, change `VERSION = 'v1'` to the next number (`v2`, `v3`...).
3. Open the app while online, close it fully and open it again.

## Cycle Compass
A private period and fertility tracker lives in the `cycle/` folder, at `/glute-tracker/cycle/`. It is a separate Home Screen app with its own data, stored only on the phone. Use **Backup > Copy backup** now and then.

To update it, upload the changed files to `cycle/` and bump `VERSION` in `cycle/sw.js`.
