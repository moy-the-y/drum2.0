import { Constants } from "../core/constants.js";
import { TapHelper } from "./tap-helper.js";

export class Metronome {
  #auctx;

  /**
   * @type {HTMLSpanElement}
   */
  #bpmElement;

  /**
   * @type {HTMLButtonElement}
   */
  #toggle;

  /**
   * @type {HTMLButtonElement}
   */
  #tap;

  /**
   * @type {HTMLButtonElement}
   */
  #incBpm;

  /**
   * @type {HTMLButtonElement}
   */
  #decBpm;

  /**
   * @type {HTMLSelectElement}
   */
  #tone;

  /**
   * @type {HTMLInputElement}
   */
  #volume;

  /**
   * @type {Map<String, AudioBuffer>}
   */
  #toneAudioBuffers = null;

  /**
   * @type {GainNode}
   */
  #gainNode;

  /**
   * setInterval id of rapid bpm changing
   * @type {Number}
   */
  #rapidChangeId;

  #MIN_BPM = 15;
  #MAX_BPM = 300;

  #tickId;
  #isTicking = false;

  #tapHelper;

  /**
   *
   * @param {AudioContext} audioContext
   * @param {*} masterGainNode
   */
  constructor(audioContext, masterGainNode) {
    this.#auctx = audioContext;

    const panel = document.querySelector("#metronome-popover");
    this.#decBpm = panel.querySelector("#metronome-dec-bpm");
    this.#incBpm = panel.querySelector("#metronome-inc-bpm");
    this.#volume = panel.querySelector("#metronome-volume");
    this.#tone = panel.querySelector("#metronome-tone");
    this.#tap = panel.querySelector("#metronome-tap");
    this.#toggle = panel.querySelector("#metronome-toggle");
    this.#bpmElement = panel.querySelector("#metronome-bpm");

    this.#gainNode = audioContext.createGain();
    this.#gainNode.connect(masterGainNode);

    this.#tapHelper = new TapHelper(this.#MIN_BPM);

    this.#setListeners();
  }

  #setListeners() {
    // settings
    // this.#tone.addEventListener("change", () => {});
    this.#volume.addEventListener("input", () => {
      this.#gainNode.gain.setValueAtTime(
        this.#volume.value,
        this.#auctx.currentTime,
      );
    });

    // tap and toggle
    this.#tap.addEventListener("click", () => {
      const tappedTempo = this.#tapHelper.onTapped();

      if (!tappedTempo) {
        return;
      }

      if (tappedTempo < this.#MIN_BPM) {
        this.#bpmElement.textContent = this.#MIN_BPM;
      } else if (tappedTempo > this.#MAX_BPM) {
        this.#bpmElement.textContent = this.#MAX_BPM;
      } else {
        this.#bpmElement.textContent = tappedTempo;
      }
    });

    this.#toggle.addEventListener("click", () => {
      if (this.#isTicking) {
        this.#stopMetronome();
      } else {
        this.#startMetronome();
      }
    });

    // bpm buttons
    this.#incBpm.addEventListener("click", () => {
      this.#changeBpm(1);
    });

    this.#decBpm.addEventListener("click", () => {
      this.#changeBpm(-1);
    });

    this.#incBpm.addEventListener("mousedown", () => {
      this.#startRapidChange(1);
    });

    this.#decBpm.addEventListener("mousedown", () => {
      this.#startRapidChange(-1);
    });

    this.#incBpm.addEventListener("mouseup", () => {
      this.#endRapidChange();
    });

    this.#decBpm.addEventListener("mouseup", () => {
      this.#endRapidChange();
    });

    this.#incBpm.addEventListener("mouseleave", () => {
      this.#endRapidChange();
    });

    this.#decBpm.addEventListener("mouseleave", () => {
      this.#endRapidChange();
    });
  }

  #changeBpm(amount) {
    amount = Math.round(amount);

    let newBpm = Number(this.#bpmElement.textContent) + amount;
    if (newBpm > this.#MAX_BPM) {
      newBpm = this.#MAX_BPM;
    }
    if (newBpm < this.#MIN_BPM) {
      newBpm = this.#MIN_BPM;
    }

    this.#bpmElement.textContent = newBpm;
  }

  #startRapidChange(delta) {
    const INTERVAL = 50;
    const RAPID_CHANGE_TRIGGER_THRESHOLD = 300;
    let holdingMS = 0;

    if (this.#rapidChangeId) {
      return;
    }

    this.#rapidChangeId = setInterval(() => {
      if (holdingMS < RAPID_CHANGE_TRIGGER_THRESHOLD) {
        holdingMS += INTERVAL;
        return;
      }

      this.#changeBpm(delta);
    }, INTERVAL);
  }

  #endRapidChange() {
    if (this.#rapidChangeId) {
      clearInterval(this.#rapidChangeId);
      this.#rapidChangeId = null;
    }
  }

  async initBuffers() {
    this.#toneAudioBuffers = new Map();

    const basePath = Constants.getMetronomeAudioAssetDirectory();
    for (const toneName of Constants.getMetronomeToneNames()) {
      const path = basePath + toneName + ".mp3";
      await this.#toneAudioBuffers.set(toneName, await this.#getBuffer(path));
      //
      console.log(path);
    }
  }

  /**
   * @returns {AudioBuffer}
   */
  async #getBuffer(filePath) {
    try {
      const res = await fetch(filePath);
      const buffer = await res.arrayBuffer();
      return await this.#auctx.decodeAudioData(buffer);
    } catch (error) {
      console.debug("[debug]", error);
    }
  }

  #playSound() {
    const sourceNode = new AudioBufferSourceNode(this.#auctx, {
      buffer: this.#toneAudioBuffers.get(this.#tone.value),
    });
    sourceNode.connect(this.#gainNode);
    sourceNode.start();
  }

  #startMetronome() {
    this.#isTicking = true;
    this.#playSound();

    this.#tickId = setTimeout(
      () => {
        this.#startMetronome();
      },
      this.#calTickInterval(Number(this.#bpmElement.textContent)),
    );
  }

  #stopMetronome() {
    clearTimeout(this.#tickId);
    this.#isTicking = false;
  }

  #calTickInterval(bpm) {
    return Math.round((60 * 1000) / bpm);
  }
}
