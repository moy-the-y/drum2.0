import { DrumFactory } from "./core/drum-factory.js";
import { MasterBus } from "./core/master-bus.js";
import { KeyboardListener } from "./core/keyboard-listener.js";
import { PresetManager } from "./preset/preset-manager.js";
import { DrumKit } from "./core/drumkit.js";
import { ComponentFactory } from "./ui/component-factory.js";
import { PopoverManager } from "./ui/popover.js";
import { Metronome } from "./metronome/metronome.js";
import { Constants } from "./core/constants.js";
import "./ui/ticker.js";

export class App {
  #isHostedOnGithub;

  #auctx = new AudioContext();

  #masterBus;

  #drumkit;

  #presetManager;

  #keyboardListener;

  #popoverManager;

  #metronome;

  constructor(isHostedOnGithub) {
    this.#isHostedOnGithub = isHostedOnGithub;
    Constants.isHostedOnGithub = this.#isHostedOnGithub;

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

    this.#metronome = new Metronome(
      this.#auctx,
      this.#masterBus.getMasterGainNode(),
    );

    await this.#metronome.initBuffers();
  }
}
