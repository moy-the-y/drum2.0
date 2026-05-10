export class DrumPart {
  // web audio api
  /** @type {AudioContext}*/
  #auctx;

  /** @type {GainNode} */
  #gainNode;

  /**
   * Purpose for mapping unique tone names to
   * corresponding source node, enable the ability of
   * switching between different tones through user settings.
   * @type {Map<string, AudioBuffer>}
   */
  #toneAudioBuffers = new Map();

  // settings
  /** @type {String} */
  #currentTone;

  /** @type {Number} */
  #currentVolume;

  /** @type {String} */
  #toneAtPop;

  /** @type {Number} */
  #volumeAtPop;

  // elements
  /** @type {HTMLInputElement} */
  #volumeSettingElement;

  /** @type {HTMLSelectElement} */
  #toneSettingElement;

  /** @type {HTMLButtonElement} */
  #confirmButton;

  /** @type {HTMLButtonElement} */
  #resetButton;

  /** @type {HTMLButtonElement} */
  #cancelButton;

  constructor(
    audioContext,
    toneNameAudioBufferMap,
    gainNode,
    volumeSettingElement,
    toneSettingElement,
    confirmButton,
    resetButton,
    cancelButton,
  ) {
    // web audio api
    this.#auctx = audioContext;
    this.#toneAudioBuffers = toneNameAudioBufferMap;
    this.#gainNode = gainNode;

    // elements
    this.#volumeSettingElement = volumeSettingElement;
    this.#toneSettingElement = toneSettingElement;
    this.#confirmButton = confirmButton;
    this.#resetButton = resetButton;
    this.#cancelButton = cancelButton;

    this.#initState();
    this.#setListeners();
  }

  #initState() {
    // 1.get initial(current) values from elements
    this.#currentTone = this.#toneSettingElement.value;
    this.#currentVolume = this.#volumeSettingElement.value;

    // 2.set up internal states using current values
    this.setGainNodeVolume(this.#currentVolume);
    this.#volumeAtPop = this.#currentVolume;
    this.#toneAtPop = this.#currentTone;
  }

  /**
   * UI handler is handled by popover.js, modifying css&html variables, not here.
   * Handlers here handle audio logic callback when user interact with UI,
   * modifying unseen states and web audio api.
   */
  #setListeners() {
    this.#volumeSettingElement.addEventListener("input", () => {
      this.#currentVolume = this.#volumeSettingElement.value;
      this.setGainNodeVolume(this.#currentVolume);
    });

    this.#toneSettingElement.addEventListener("change", () => {
      this.#currentTone = this.#toneSettingElement.value;
    });

    // User at this point might have done some changes to audio settings,
    // these buttons provide options for keep, undo, or discard changes to web audio api.
    this.#confirmButton.addEventListener("click", () => {
      this.#doAtExit();
    });

    this.#resetButton.addEventListener("click", () => {
      this.#resetToPopState();
    });

    this.#cancelButton.addEventListener("click", () => {
      this.#resetToPopState();
      this.#doAtExit();
    });
  }

  // reset to when the setting panel was popped out
  #resetToPopState = () => {
    this.#currentVolume = this.#volumeAtPop;
    this.setGainNodeVolume(this.#currentVolume);
    this.#currentTone = this.#toneAtPop;

    this.#volumeSettingElement.value = this.#currentVolume;
    this.#toneSettingElement.value = this.#currentTone;
  };

  #doAtExit = () => {
    // set for the 'atPop' variables for the next popover
    this.#volumeAtPop = this.#currentVolume;
    this.#toneAtPop = this.#currentTone;
  };

  setGainNodeVolume = (volume) => {
    this.#gainNode.gain.setValueAtTime(volume, this.#auctx.currentTime);
  };

  setTone = (tone) => {
    this.#currentTone = tone;
  };

  playSound = () => {
    const sourceNode = new AudioBufferSourceNode(this.#auctx, {
      buffer: this.#toneAudioBuffers.get(this.#currentTone),
    });
    sourceNode.connect(this.#gainNode);
    sourceNode.start();
  };
}
