import { DrumFactory } from "./core/drum-factory.js";
import { MasterBus } from "./core/master-bus.js";
import { KeyboardListener } from "./core/keyboard-listener.js";
import { PresetManager } from "./preset/preset-manager.js";
import { DrumKit } from "./core/drumkit.js";

export class App {
  #auctx = new AudioContext();

  #masterBus;

  #drumkit;

  #presetManager;

  #keyboardListener;

  constructor() {
    this.#masterBus = new MasterBus(this.#auctx);
    const drumFactory = new DrumFactory(
      this.#auctx,
      this.#masterBus.getMasterGainNode(),
    );

    this.asyncBuild(this.#auctx, drumFactory);
  }

  /** @param {DrumFactory} drumFactory */
  async asyncBuild(audioContext, drumFactory) {
    this.#drumkit = new DrumKit(
      audioContext,
      await drumFactory.buildAllDrumParts(),
    );
    this.#presetManager = new PresetManager(this.#drumkit);
    this.#keyboardListener = new KeyboardListener(audioContext, this.#drumkit);
  }
}
