import { Constants } from "./constants.js";
import { DrumKit } from "./drumkit.js";

export class KeyboardListener {
  /** @type {AudioContext} */
  #auctx;

  /** @type {DrumKit} */
  #drumkit;

  #keyMap = new Map();

  constructor(audioContext, drumkit) {
    this.#auctx = audioContext;
    this.#drumkit = drumkit;
    this.#resetKeyMap();
    this.#setListeners();
  }

  /**
   *
   * @param {KeyboardEvent} ev
   */
  async #keyboardInputHandler(ev) {
    if (!this.#keyMap.has(ev.key.toLowerCase())) {
      return;
    }

    // dealing with autoplay policy
    if (this.#auctx.state === "suspended") {
      await this.#auctx.resume(); // state resumes to running
    }

    const drumpartName = this.#keyMap.get(ev.key.toLowerCase());
    this.#drumkit.playDrumpart(drumpartName);
  }

  #resetKeyMap() {
    for (const [key, drumPartName] of Constants.getDefaultKeyMap()) {
      this.#keyMap.set(key, drumPartName);
    }
  }

  #setListeners() {
    window.addEventListener("keydown", (ev) => {
      this.#keyboardInputHandler(ev);
    });
  }
}
