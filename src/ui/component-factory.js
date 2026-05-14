import { LoadPresetComponent } from "./preset/load-preset-component.js";
import { SavePresetComponent } from "./preset/save-preset-component.js";

export class ComponentFactory {
  #popoverManager;

  constructor(popoverManager) {
    this.#popoverManager = popoverManager;
  }

  buildLoadPreset() {
    return new LoadPresetComponent(
      document.querySelector("#load-preset-popover__main"),
      "preset-name",
      "preset-card",
      this.#popoverManager,
    );
  }

  buildSavePreset() {
    const savePresetPopover = document.querySelector("#save-preset-popover");
    return new SavePresetComponent(
      savePresetPopover,
      savePresetPopover.querySelector("input[type='text']"),
      savePresetPopover.querySelector("input[type='color']"),
      savePresetPopover.querySelector("#confirm"),
      savePresetPopover.querySelector("cancel"),
    );
  }
}
