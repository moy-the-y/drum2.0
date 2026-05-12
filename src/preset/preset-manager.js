import { Constants } from "../core/constants.js";
import { DrumKit } from "../core/drumkit.js";

export class PresetManager {
  /** @type {Map<String, Object>} */
  #presets = new Map();

  /** @type {DrumKit} */
  #drumkit;

  //todo element listener and shit..

  constructor(drumkit) {
    this.#setDefaultPresets();
    this.#drumkit = drumkit;
  }

  async #setDefaultPresets() {
    const root = Constants.getDrumPresetRoot();
    const tones = Constants.getToneNames();

    for (const tone of tones) {
      const res = await fetch(`${root}${tone}.json`);
      const jsonObj = await res.json();
      this.#presets.set(tone, jsonObj);
    }
  }

  applyPreset(presetName) {
    const presetJsonObj = this.#presets.get(presetName);
    if (!presetJsonObj) {
      throw new Error(
        `Invalid argument error. Can't find preset: '${presetName}'.`,
      );
    }

    for (const drumpart of Constants.getDrumPartNames) {
      const volume = presetJsonObj[drumpart]["volume"];
      const tone = presetJsonObj[drumpart]["tone"];

      this.#drumkit.getPart(drumpart).setGainNodeVolume(volume);
      this.#drumkit.getPart(drumpart).setTone(tone);
    }
  }
}
