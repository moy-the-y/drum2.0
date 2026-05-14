import { DrumFactory } from "./drum-factory.js";
import { DrumPart } from "./drum-part.js";

export class DrumKit {
  /** @type {AudioContext} */
  #auctx;

  /**
   *  @type {Map<string, DrumPart>}
   */
  #drumparts;

  constructor(audioContext, nameDrumPartsMap) {
    this.#auctx = audioContext;
    this.#drumparts = nameDrumPartsMap;
  }

  playDrumpart(drumpartName) {
    this.#drumparts.get(drumpartName).playSound();
  }

  getPart(drumpartName) {
    return this.#drumparts.get(drumpartName);
  }

  get drumparts() {
    return this.#drumparts;
  }
}
