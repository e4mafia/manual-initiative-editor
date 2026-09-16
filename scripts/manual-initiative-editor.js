/**
 * Manual Initiative Editor
 * ------------------------
 * Double-click a combatant's initiative value in the Combat Tracker to
 * replace it with a number input, type a new value, and press Enter
 * (or click away) to save it.
 *
 * Works with both the legacy (jQuery-based) Combat Tracker and the
 * ApplicationV2 Combat Tracker used in Foundry v13, since it delegates
 * a single dblclick listener on the tracker's root element rather than
 * binding to individual rows (which get rebuilt on every render).
 */

const MODULE_ID = "manual-initiative-editor";

/** Selectors that have been used for the initiative display across recent core versions. */
const INITIATIVE_SELECTOR = ".token-initiative, .initiative, .combatant-initiative";

/** Selector for the list item / row that carries the combatant's id. */
const COMBATANT_ROW_SELECTOR = "[data-combatant-id]";

Hooks.on("renderCombatTracker", (app, html) => {
  // ApplicationV2 (v13) passes a raw HTMLElement; the legacy Application
  // passes a jQuery object. Normalize to a plain element either way.
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;

  refreshTooltips(root);

  // The ApplicationV2 tracker keeps the same root element across re-renders
  // and only swaps out its inner parts, so guard against double-binding.
  if (root.dataset.manualInitiativeBound === "true") return;
  root.dataset.manualInitiativeBound = "true";

  root.addEventListener("dblclick", (event) => onDoubleClick(event, app));
});

/** Add a helpful tooltip to initiative displays for the GM. */
function refreshTooltips(root) {
  if (!game.user.isGM) return;
  for (const el of root.querySelectorAll(INITIATIVE_SELECTOR)) {
    el.title = "Double-click to set initiative manually";
  }
}

function getCombatantId(el) {
  const row = el.closest(COMBATANT_ROW_SELECTOR);
  return row?.dataset?.combatantId ?? null;
}

async function onDoubleClick(event, app) {
  // Only the GM should be hand-editing initiative values.
  if (!game.user.isGM) return;

  const target = event.target.closest(INITIATIVE_SELECTOR);
  if (!target || target.tagName === "INPUT") return;

  const combatantId = getCombatantId(target);
  if (!combatantId) return;

  const combat = app.viewed ?? game.combat;
  const combatant = combat?.combatants?.get(combatantId);
  if (!combat || !combatant) return;

  event.preventDefault();
  event.stopPropagation();

  const originalHTML = target.innerHTML;
  const currentValue = combatant.initiative ?? "";

  const input = document.createElement("input");
  input.type = "number";
  input.step = "any";
  input.value = currentValue;
  input.classList.add("manual-initiative-input");

  target.innerHTML = "";
  target.appendChild(input);
  input.focus();
  input.select();

  let resolved = false;

  const restore = () => {
    if (target.contains(input)) target.innerHTML = originalHTML;
  };

  const commit = async () => {
    if (resolved) return;
    resolved = true;

    const value = parseFloat(input.value);
    if (Number.isNaN(value)) {
      restore();
      return;
    }

    try {
      // combat.setInitiative() updates the combatant and triggers a
      // re-render, which will naturally replace this input with the
      // freshly formatted initiative display.
      await combat.setInitiative(combatantId, value);
    } catch (err) {
      console.error(`${MODULE_ID} | Failed to set initiative`, err);
      ui.notifications?.error("Failed to set initiative. See console for details.");
      restore();
    }
  };

  const cancel = () => {
    if (resolved) return;
    resolved = true;
    restore();
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
    // Prevent Foundry's global hotkeys from firing while typing.
    e.stopPropagation();
  });

  input.addEventListener("blur", () => commit());
  input.addEventListener("click", (e) => e.stopPropagation());
  input.addEventListener("dblclick", (e) => e.stopPropagation());
}
