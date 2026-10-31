export class DrumpartHighlight {
  #drumparts;

  #HIGHLIGHT_BLINK_MILSEC = 200;

  constructor() {
    const snare = document.querySelector("#drumpart-pop-trigger-snare");
    const hihatOpen = document.querySelector(
      "#drumpart-pop-trigger-hihat-open",
    );
    const hihatClose = document.querySelector(
      "#drumpart-pop-trigger-hihat-close",
    );
    const crash = document.querySelector("#drumpart-pop-trigger-crash");
    const tom1 = document.querySelector("#drumpart-pop-trigger-tom1");
    const tom2 = document.querySelector("#drumpart-pop-trigger-tom2");
    const tom3 = document.querySelector("#drumpart-pop-trigger-tom3");
    const kick = document.querySelector("#drumpart-pop-trigger-kick");
    const ride = document.querySelector("#drumpart-pop-trigger-ride");

    this.#drumparts = new Map([
      ["snare", snare],
      ["kick", kick],
      ["hihat-open", hihatOpen],
      ["hihat-close", hihatClose],
      ["crash", crash],
      ["ride", ride],
      ["tom1", tom1],
      ["tom2", tom2],
      ["tom3", tom3],
    ]);
  }

  highlight(drumpartName) {
    const ele = this.#drumparts.get(drumpartName);

    if (ele == null) {
      console.warn(
        `fail to highlight drum hitting effect on drumpart ${drumpartName}`,
      );
      return;
    }

    const highlightEffectClass = "drumpart-pop-trigger__hover";

    // If it is already at highlighted state, etc continuously fast strike, stay highlighted to kill potential glitch
    if (!ele.classList.contains(highlightEffectClass)) {
      ele.classList.add(highlightEffectClass);
      setTimeout(() => {
        ele.classList.remove(highlightEffectClass);
      }, this.#HIGHLIGHT_BLINK_MILSEC);
    }
  }
}
