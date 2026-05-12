import { Constants } from "../core/constants.js";
import { DrumKit } from "../core/drumkit.js";
import { LoadPresetComponent } from "../ui/preset/load-preset-component.js";

export class PresetManager {
  /** @type {Map<String, Object>} */
  #presets = new Map();

  /** @type {DrumKit} */
  #drumkit;

  /** @type {LoadPresetComponent} */
  #loadPresetComponent;

  constructor(drumkit, loadPresetComponent) {
    this.#saveDefaultPresets();
    this.#drumkit = drumkit;
    this.#loadPresetComponent = loadPresetComponent;
  }

  async #saveDefaultPresets() {
    const root = Constants.getDrumPresetRoot();
    const tones = Constants.getToneNames();

    for (const tone of tones) {
      const res = await fetch(`${root}${tone}.json`);
      const jsonObj = await res.json();
      this.#saveNewPreset(tone, "#43648a", jsonObj);
    }
  }

  #saveNewPreset(name, color, jsonObj) {
    this.#presets.set(name, jsonObj);
    const presetCard = this.#loadPresetComponent.addPresetCard(name, color);
    presetCard.addEventListener("click", () => {
      this.applyPreset(name);
    });
  }

  applyPreset(presetName) {
    const presetJsonObj = this.#presets.get(presetName);
    if (!presetJsonObj) {
      throw new Error(
        `Invalid argument error. Can't find preset: '${presetName}'.`,
      );
    }

    for (const drumpart of Constants.getDrumPartNames()) {
      const volume = presetJsonObj[drumpart]["volume"];
      const tone = presetJsonObj[drumpart]["tone"];

      this.#drumkit.getPart(drumpart).setVolume(volume);
      this.#drumkit.getPart(drumpart).setTone(tone);
      this.#drumkit.getPart(drumpart).updateResetValues();
    }
  }
}
