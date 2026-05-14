import { Constants } from "../core/constants.js";
import { DrumKit } from "../core/drumkit.js";
import { LoadPresetComponent } from "../ui/preset/load-preset-component.js";
import { SavePresetComponent } from "../ui/preset/save-preset-component.js";

export class PresetManager {
  /** @type {Map<String, Object>} */
  #presets = new Map();

  /** @type {DrumKit} */
  #drumkit;

  /** @type {LoadPresetComponent} */
  #loadPresetComponent;

  /** @type {SavePresetComponent} */
  #savePresetComponent;

  constructor(drumkit, loadPresetComponent, savePresetComponent) {
    this.#loadDefaultPresets();
    this.#drumkit = drumkit;
    this.#loadPresetComponent = loadPresetComponent;
    this.#savePresetComponent = savePresetComponent;
    this.#setSavePresetListener();
  }

  async #loadDefaultPresets() {
    const root = Constants.getDrumPresetRoot();
    const tones = Constants.getToneNames();

    for (const tone of tones) {
      const res = await fetch(`${root}${tone}.json`);
      const jsonObj = await res.json();
      this.#savePreset(tone, "#43648a", jsonObj);
    }
  }

  #setSavePresetListener() {
    this.#savePresetComponent.popover
      .querySelector("#confirm")
      .addEventListener("click", () => {
        this.#savePreset(
          this.#savePresetComponent.nameInput.value,
          this.#savePresetComponent.colorInput.value,
          this.#getCurrentSetup(),
        );
      });

    this.#savePresetComponent.popover
      .querySelector("#cancel")
      .addEventListener("click", () => {
        this.#savePresetComponent.nameInput.value = "";
      });
  }

  #getCurrentSetup() {
    const setupObj = new Object();
    for (const [name, part] of this.#drumkit.drumparts.entries()) {
      const partSetup = new Object();
      partSetup["volume"] = part.currentVolume;
      partSetup["tone"] = part.currentTone;
      setupObj[name] = partSetup;
    }

    return setupObj;
  }

  #savePreset(name, color, jsonObj) {
    this.#presets.set(name, jsonObj);
    const presetCard = this.#loadPresetComponent.addPresetCard(name, color);
    presetCard.addEventListener("click", () => {
      this.#loadPreset(name);
    });
  }

  #loadPreset(presetName) {
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
