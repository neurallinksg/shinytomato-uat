# shinytomato-uat

Generated **GitHub Pages** UAT preview for ShinyTomato.

**Published site URL (once Pages is enabled):** https://neurallinksg.github.io/shinytomato-uat/

## Layout

| Path | Role |
|---|---|
| `site/` | **Only** generated publication directory (GitHub Actions publishes its contents) |
| `.github/workflows/uat-pages.yml` | Official Pages deploy workflow |
| `README.md` / `.gitignore` | Repository configuration (not website content) |

Do **not** keep a second copy of the website at the repository root.

## Source of truth

- Authoritative development: `D:\CursorProject\ShinyTomatoV2`
- This repository is **generated**. Normal coding updates V2 only.
- Refresh UAT only on an explicit instruction such as `UAT test now`.
- Upload with `D:\CursorProject\Upload-ShinyTomato-UAT.cmd` (commit + push verified `site/`). Tooling never auto-deploys Vodien production.

## Operator notes

- Latest local Mode B build id is recorded in `site/uat-build-marker.json`.
- Local Pages-path preview helper: `gh-pages-sim/` (gitignored junction; do not upload).
- Private project records stay outside this repository.
- GitHub Pages does **not** honour Apache `.htaccess`. Keep Apache checks on the separate Target B workflow.

Private workflow record:

`D:\CursorProject\SHINYTOMATO_PROJECT_RECORDS\26_SHINYTOMATO_V2_UAT_MANUAL_TRIGGER_WORKFLOW.md`
