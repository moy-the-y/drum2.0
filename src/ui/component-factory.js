import { LoadPresetComponent } from "./preset/load-preset-component.js";

export class ComponentFactory {
  constructor() {}

  buildLoadPreset() {
    return new LoadPresetComponent(
      document.querySelector("#load-preset-popover__main"),
      "preset-name",
      "preset-card",
    );
  }
}
