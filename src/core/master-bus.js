export class MasterBus {
  #auctx;
  #masterGainNode;

  constructor(audioContext) {
    this.#auctx = audioContext;

    this.#initNodes();
    this.#setListeners();
    this.#chainUp();
  }

  getMasterGainNode() {
    return this.#masterGainNode;
  }

  #initNodes() {
    this.#masterGainNode = this.#auctx.createGain();
  }

  #setListeners() {
    // volume
    const masterVolumeInput = document.querySelector("#volume-slider");
    masterVolumeInput.addEventListener("input", () => {
      this.#volumeChangeHandler(masterVolumeInput);
    });
  }

  #chainUp() {
    this.#masterGainNode.connect(this.#auctx.destination);
  }

  #volumeChangeHandler(volumeInputElement) {
    this.#masterGainNode.gain.setValueAtTime(
      volumeInputElement.value,
      this.#auctx.currentTime,
    );
  }
}
