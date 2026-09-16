# Manual Initiative Editor

A tiny Foundry VTT (v13) module: double-click a combatant's initiative
value in the Combat Tracker to type in a new number by hand.

## Installation

### Option A — via manifest URL (recommended once published on GitHub)

1. In Foundry, go to **Add-on Modules → Install Module**.
2. Paste this into the Manifest URL field:
   `https://raw.githubusercontent.com/e4mafia/manual-initiative-editor/main/module.json`
3. Click **Install**, then enable **Manual Initiative Editor** in your World's
   **Manage Modules** settings.

### Option B — manual install

1. Download/unzip this folder so it becomes:
   `<FoundryData>/Data/modules/manual-initiative-editor/`
   (it must contain `module.json` directly inside that folder).
2. Restart Foundry (or reload the Setup page) so it picks up the new module.
3. In your World, go to **Settings → Manage Modules**, enable
   **Manual Initiative Editor**, and save.

## Publishing this to your own GitHub (e4mafia)

No GitHub Release needed — `module.json`'s `download` field points at
GitHub's auto-generated branch archive:
`https://github.com/e4mafia/manual-initiative-editor/archive/refs/heads/main.zip`
GitHub builds that zip on the fly from whatever is currently on `main`, so
it's always available with zero extra steps.

1. Create a new repo, e.g. `manual-initiative-editor`, under your account.
2. Push the contents of this folder to the `main` branch, keeping the
   layout intact: `module.json` at the repo root, JS in `scripts/`, CSS in
   `styles/`.
3. That's it — the manifest URL and download URL both work immediately.
4. Whenever you make changes, just commit to `main` and bump `version` in
   `module.json`. The branch archive always reflects the latest commit, so
   there's nothing else to update.

## Usage

- Open the Combat Tracker with an active encounter.
- As the GM, double-click any combatant's initiative number.
- It turns into a text box — type the new value.
- Press **Enter** (or click elsewhere) to save it, or **Esc** to cancel.

## Notes

- Only the GM can edit initiative this way (matches how initiative is
  normally managed).
- This only changes how you *enter* a value manually — it doesn't touch
  dice rolling, turn order, or any other combat behavior.
- Built against the Foundry v13 Combat Tracker; it uses generic selectors
  and should keep working if minor markup tweaks happen in later point
  releases, but let me know if a specific system's custom tracker doesn't
  pick it up.
