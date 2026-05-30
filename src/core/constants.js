export class Constants {
  // drum
  static #drumPartNames = Object.freeze([
    "snare",
    "kick",
    "hihat-open",
    "hihat-close",
    "crash",
    "ride",
    "tom1",
    "tom2",
    "tom3",
  ]);

  static #defaultKeyMap = Object.freeze(
    new Map([
      ["a", "snare"],
      ["s", "snare"],
      ["z", "kick"],
      ["x", "kick"],
      ["w", "hihat-open"],
      ["e", "hihat-open"],
      ["r", "hihat-close"],
      ["t", "hihat-close"],
      ["y", "crash"],
      ["u", "ride"],
      ["g", "tom1"],
      ["h", "tom2"],
      ["j", "tom3"],
    ]),
  );

  static #toneNames = Object.freeze(["rock", "punk"]);

  static #drumAudioAssetDirectory = "/res/audio/drum/";

  static #drumDataPresetDirectory = "/res/data/drum-preset/";

  // metronome
  static #metronomeToneNames = Object.freeze(["digital", "cowbell"]);

  static #metronomeAudioAssetDirectory = "/res/audio/metronome/";

  // drum
  static getDrumPartNames() {
    return Constants.#drumPartNames;
  }

  static getToneNames() {
    return Constants.#toneNames;
  }

  static getDrumAudioRoot() {
    return Constants.#drumAudioAssetDirectory;
  }

  static getDefaultKeyMap() {
    return this.#defaultKeyMap;
  }

  static getDrumPresetRoot() {
    return this.#drumDataPresetDirectory;
  }

  // metronome
  static getMetronomeAudioAssetDirectory() {
    return Constants.#metronomeAudioAssetDirectory;
  }

  static getMetronomeToneNames() {
    return Constants.#metronomeToneNames;
  }
}
