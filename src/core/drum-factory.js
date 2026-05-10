import { Constants } from "./constants.js";
import { DrumPart } from "./drum-part.js";

/**
 * Used to build a Map<drumpart name {String}, drumPart {DrumPart}>
 */
export class DrumFactory {
  /** @type {AudioContext} */
  #auctx;
  #masterGainNode;

  /**
   *
   * @param {AudioContext} audioContext
   */
  constructor(audioContext, masterGainNode) {
    this.#auctx = audioContext;
    this.#masterGainNode = masterGainNode;
  }

  /**
   *
   * @returns {Map<String, DrumPart>}
   */
  async buildAllDrumParts() {
    const namePartMap = new Map();
    for (const name of Constants.getDrumPartNames()) {
      namePartMap.set(name, await this.#buildDrumpart(name));
    }

    return namePartMap;
  }

  /**
   *
   * @param {String} partName
   * @returns {DrumPart}
   */
  async #buildDrumpart(partName) {
    if (!Constants.getDrumPartNames().includes(partName)) {
      throw new Error(
        `Invalid argument:"${partName}", ` +
          `can't find name "${partName}" in ` +
          `available drum part name list ` +
          `${Constants.getDrumPartNames()}`,
      );
    }

    const toneNameAudioBufferMap = new Map();
    for (const toneName of Constants.getToneNames()) {
      toneNameAudioBufferMap.set(
        toneName,
        await this.#getBuffer(
          this.#auctx,
          this.#getFilePath(toneName, partName),
        ),
      );
    }

    const partPanel = document.querySelector(`#drumkit-${partName}-popover`);
    return new DrumPart(
      this.#auctx,
      toneNameAudioBufferMap,
      this.#buildDrumpartGainNode(),
      partPanel.querySelector(`#${partName}-volume`),
      partPanel.querySelector(`#${partName}-tone`),
      partPanel.querySelector("#confirm"),
      partPanel.querySelector("#reset"),
      partPanel.querySelector("#cancel"),
    );
  }

  #buildDrumpartGainNode() {
    const partGainNode = this.#auctx.createGain();
    partGainNode.connect(this.#masterGainNode);
    return partGainNode;
  }

  /**
   *
   * @param {AudioContext} auctx
   * @param {*} filePath
   * @returns {AudioBuffer}
   */
  async #getBuffer(auctx, filePath) {
    try {
      const res = await fetch(filePath);
      const buffer = await res.arrayBuffer();
      return await auctx.decodeAudioData(buffer);
    } catch (error) {
      console.debug("[debug]", error);
    }
  }

  #getFilePath(toneName, partName) {
    const root = Constants.getDrumAudioRoot();
    return root + toneName + "/" + partName + ".mp3";
  }
}
