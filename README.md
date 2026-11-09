# shinytomato-uat

Generated **GitHub Pages** UAT preview for ShinyTomato.

**Published site URL:** https://neurallinksg.github.io/shinytomato-uat/

## Deploy mode

GitHub Pages → **Deploy from a branch** → **main** → **/(root)**

The generated website files live at the **repository root** (`index.html`, `about/`, `assets/`, …).

Do **not** keep a second copy under `site/`.

## Source of truth

- Authoritative development: `D:\CursorProject\ShinyTomatoV2`
- This repository is **generated**. Normal coding updates V2 only.
- Refresh UAT only on an explicit instruction such as `UAT test now`.
- Upload with `D:\CursorProject\Upload-ShinyTomato-UAT.cmd` (commit + push verified root UAT). Tooling never auto-deploys Vodien production.

## Repository meta (not website content)

| Path | Role |
|---|---|
| `README.md` / `.gitignore` | Repository configuration |
| `.git/` | History / rollback |
| `uat-build-marker.json` / `_uat_manifest.json` | Generated UAT build provenance |

## Operator notes

- Local Pages-path preview helper: `gh-pages-sim/` (gitignored junction; do not upload).
- Private project records stay outside this repository.
- GitHub Pages does **not** honour Apache `.htaccess`. Keep Apache checks separate.

Private workflow record:

`D:\CursorProject\SHINYTOMATO_PROJECT_RECORDS\26_SHINYTOMATO_V2_UAT_MANUAL_TRIGGER_WORKFLOW.md`
