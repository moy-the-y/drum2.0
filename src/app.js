import { DrumFactory } from "./core/drum-factory.js";
import { MasterBus } from "./core/master-bus.js";
import { KeyboardListener } from "./core/keyboard-listener.js";
import { PresetManager } from "./preset/preset-manager.js";
import { DrumKit } from "./core/drumkit.js";
import { ComponentFactory } from "./ui/component-factory.js";
import { PopoverManager } from "./ui/popover.js";
import "./ui/ticker.js";

export class App {
  #auctx = new AudioContext();

  #masterBus;

  #drumkit;

  #presetManager;

  #keyboardListener;

  #popoverManager;

  constructor() {
    this.#popoverManager = new PopoverManager();
    this.#popoverManager.initializeUILogic();

    this.#masterBus = new MasterBus(this.#auctx);

    const drumFactory = new DrumFactory(
      this.#auctx,
      this.#masterBus.getMasterGainNode(),
    );

    const uiComponentFactory = new ComponentFactory(this.#popoverManager);

    this.asyncBuild(this.#auctx, drumFactory, uiComponentFactory);
  }

  /**
   * @param {DrumFactory} drumFactory
   * @param {ComponentFactory} uiComponentFactory
   */
  async asyncBuild(audioContext, drumFactory, uiComponentFactory) {
    this.#drumkit = new DrumKit(
      audioContext,
      await drumFactory.buildAllDrumParts(),
    );
    this.#presetManager = new PresetManager(
      this.#drumkit,
      uiComponentFactory.buildLoadPreset(),
      uiComponentFactory.buildSavePreset(),
    );
    this.#keyboardListener = new KeyboardListener(audioContext, this.#drumkit);
  }
}
