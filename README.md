# Mamma Mia Menu Generator

Builds the weekly menu for Panatieri's on Wheels and downloads it as a
2304 x 1728 PNG, ready to post.

Live at: https://jaylaantaylor-boop.github.io/menu-generator/

## Uploading a new version

Upload the **files themselves**, not the folder that contains them.
Every file must sit flat at the top level of the repo. If you drag the
folder in, GitHub keeps the folder and the site serves the old copy.

After uploading, the repo root should look exactly like this:

    index.html
    manifest.webmanifest
    icon-180.png
    icon-192.png
    icon-512.png
    .nojekyll
    README.md

## Notes

- Everything is stored in the browser: the dish library, the menu
  history and the week in progress. It does not sync between devices.
- Storage keys are prefixed `mmt_menugen_` so they cannot collide with
  the inventory apps on the same github.io origin.
- There is deliberately no service worker, so there is no stale cache to
  clear. A hard refresh always gets the newest version.
- Back the library up now and then with **Export library (JSON)**.
