# Menu Generator

Builds the weekly menu for Panatieri's on Wheels and downloads it as a
2304 x 1728 PNG, ready to post.

Live at: https://jaylaantaylor-boop.github.io/menu-generator/

## Uploading a new version

Upload the **files themselves**, not the folder that contains them.
Every file must sit flat at the top level of the repo. If you drag the
folder in, GitHub keeps the folder and the site serves the old copy.

Normally `index.html` is the only file that changes.

After uploading, the repo root should look exactly like this:

    index.html
    manifest.webmanifest
    sw.js
    icon-180.png
    icon-192.png
    icon-512.png
    README.md

## Notes

- Everything is stored in the browser: the dish library, the menu
  history and the week in progress. It does not sync between devices.
- Storage keys are prefixed `mmt_menugen_` so they cannot collide with
  the inventory apps on the same github.io origin.
- The service worker (`sw.js`) is **network-first on purpose**: it tries
  the network first and re-caches on every successful fetch, so an
  online device gets a new deploy the next time it opens the app. There
  is nothing to bump and no cache to clear after uploading a new
  `index.html`. The stored copy only steps in when there is no signal.
- Back the library up now and then with **Export library (JSON)**.
