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
  #toneForReset;

  /** @type {Number} */
  #volumeForReset;

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
    this.setTone(this.#toneSettingElement.value);
    this.setVolume(this.#volumeSettingElement.value);

    // 2.set up internal states using current values
    this.#volumeForReset = this.#currentVolume;
    this.#toneForReset = this.#currentTone;
  }

  /**
   * UI handler is handled by popover.js, modifying css&html variables, not here.
   * Handlers here handle audio logic callback when user interact with UI,
   * modifying unseen states and web audio api.
   */
  #setListeners() {
    this.#volumeSettingElement.addEventListener("input", () => {
      this.setVolume(this.#volumeSettingElement.value);
    });

    this.#toneSettingElement.addEventListener("change", () => {
      this.setTone(this.#toneSettingElement.value);
    });

    // User at this point might have done some changes to audio settings,
    // these buttons provide options for keep, undo, or discard changes to web audio api.
    this.#confirmButton.addEventListener("click", () => {
      this.updateResetValues();
    });

    this.#resetButton.addEventListener("click", () => {
      this.#resetToPopState();
    });

    this.#cancelButton.addEventListener("click", () => {
      this.#resetToPopState();
      this.updateResetValues();
    });
  }

  // reset to when the setting panel was popped out
  #resetToPopState = () => {
    this.setVolume(this.#volumeForReset);
    this.setTone(this.#toneForReset);
  };

  /**
   * When being called, set current values to 'reset value',
   * after this, but before function being called again,
   * we are able to reset to the values here.
   * It is like creating a new 'save point'.
   */
  updateResetValues = () => {
    // set for the 'atPop'/'for reset purpose' variables for the next reset operation
    this.#volumeForReset = this.#currentVolume;
    this.#toneForReset = this.#currentTone;
  };

  setVolume = (volume) => {
    // set internal state
    this.#currentVolume = volume;

    // set audio api
    this.#gainNode.gain.setValueAtTime(volume, this.#auctx.currentTime);

    // set ui element
    this.#volumeSettingElement.value = volume;
  };

  setTone = (tone) => {
    // set internal state
    this.#currentTone = tone;

    // set ui element
    this.#toneSettingElement.value = tone;
  };

  get currentTone() {
    return this.#currentTone;
  }

  get currentVolume() {
    return this.#currentVolume;
  }

  playSound = () => {
    const sourceNode = new AudioBufferSourceNode(this.#auctx, {
      buffer: this.#toneAudioBuffers.get(this.#currentTone),
    });
    sourceNode.connect(this.#gainNode);
    sourceNode.start();
  };
}
