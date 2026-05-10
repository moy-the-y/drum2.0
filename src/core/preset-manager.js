import { Constants } from "./constants.js";
import { DrumKit } from "./drumkit.js";

export class PresetManager {
  /** @type {Map<String, Object>} */
  #presets;

  /** @type {DrumKit} */
  #drumkit;

  //todo element listener and shit..

  constructor(drumkit) {
    this.#presets = this.#initPresets();
    this.#drumkit = drumkit;
  }

  async #initPresets() {
    const toneNamePresetMap = new Map();
    const root = Constants.getDrumPresetRoot();
    const tones = Constants.getToneNames();

    for (const tone of tones) {
      const res = await fetch(`${root}${tone}.json`);
      const jsonObj = await res.json();
      toneNamePresetMap.set(tone, jsonObj);
    }

    return toneNamePresetMap;
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
