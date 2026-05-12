export class LoadPresetComponent {
  #presetContainer;

  // preset card
  #cardNameAttr;
  #cardClass;

  constructor(presetCardContainer, presetCardNameAttribute, presetCardClass) {
    this.#presetContainer = presetCardContainer;
    this.#cardNameAttr = presetCardNameAttribute;
    this.#cardClass = presetCardClass;
  }

  #tryGetCard(name) {
    const cards = this.#presetContainer.querySelectorAll(`.${this.#cardClass}`);
    for (const card of [...cards]) {
      if (card[this.#cardNameAttr] === name) {
        return card;
      }
    }
    return false;
  }

  /**
   *
   * @returns {HTMLElement}
   */
  addPresetCard(name, color) {
    const card = document.createElement("div");
    card.textContent = name;
    card.style.backgroundColor = color;
    card.classList.add(this.#cardClass);
    card[this.#cardNameAttr] = name;

    this.#presetContainer.appendChild(card);

    return card;
  }

  removePresetCard(name) {
    const card = this.#tryGetCard(name);
    if (!card) {
      return;
    }

    this.#presetContainer.removeChild(card);
  }
}
