export class TapHelper {
  #TEMPOS_USED_FOR_AVG_LIMIT = 7;
  #INDICATE_AFK_TEMPO;

  #tempos = [];
  #preciseTempo = null;
  #lastTap = null;

  constructor(minimalAllowedBpm) {
    this.#INDICATE_AFK_TEMPO = minimalAllowedBpm;
  }

  onTapped() {
    if (!this.#lastTap) {
      this.#lastTap = Date.now();
      return;
    }

    this.#updateTempos();
    this.#updatePreciseTempo();

    this.#lastTap = Date.now();

    return this.#preciseTempo;
  }

  #updateTempos() {
    const tem = (60 * 1000) / (Date.now() - this.#lastTap);

    if (tem < this.#INDICATE_AFK_TEMPO) {
      this.#tempos.length = 0;
    } else {
      this.#tempos.push(tem);
    }
  }

  #updatePreciseTempo() {
    let usedCount = 0;
    let sum = 0;
    for (let i = this.#tempos.length - 1; i >= 0; i--) {
      if (usedCount >= this.#TEMPOS_USED_FOR_AVG_LIMIT) {
        break;
      }
      sum += this.#tempos[i];
      usedCount++;
    }

    this.#preciseTempo = Math.round(sum / usedCount);
  }
}
