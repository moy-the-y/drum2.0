export class Constants {
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

  static #toneNames = Object.freeze(["rock", "punk"]);

  static #audioDrumAssetDirectory = "/res/audio/drum";

  static getDrumPartNames() {
    return Constants.#drumPartNames;
  }

  static getToneName() {
    return Constants.#toneNames;
  }

  static getAudioAssetRoot() {
    return Constants.#audioDrumAssetDirectory;
  }
}
