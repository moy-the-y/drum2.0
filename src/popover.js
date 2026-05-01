class PopoverManager {
  #currentPoppedStack = new Array();
  #registeredPopovers = new Map(); // trigger : popover

  #isFreezing = false;

  constructor() {
    // default close behavior
    window.addEventListener("click", (triggerEvent) =>
      this.#closeLastPopover(triggerEvent),
    );
  }

  #closeLastPopover = (triggerEvent) => {
    if (this.#currentPoppedStack.length === 0) {
      return;
    }

    // only close if triggered outside the current popover area to avoid conflict
    if (
      this.#isClickedInsidePopover(
        triggerEvent,
        this.#currentPoppedStack.at(-1),
      )
    ) {
      return;
    }

    const popover = this.#currentPoppedStack.pop();
    popover.style = "display:none";
    this.#isFreezing = false; // reenable other triggers.
  };

  #isClickedInsidePopover = (clickEvent, popoverElement) => {
    const rect = popoverElement.getBoundingClientRect();
    const clickX = clickEvent.x;
    const clickY = clickEvent.y;

    if (
      clickX > rect.left &&
      clickX < rect.left + rect.width &&
      clickY > rect.top &&
      clickY < rect.top + rect.height
    ) {
      return true;
    }
    return false;
  };

  registerPopoverOnClick = (triggerElement, popoverDiv) => {
    // main logic
    triggerElement.addEventListener("click", (ev) => {
      ev.stopPropagation();

      if (this.#isFreezing) {
        return;
      }

      if (this.#currentPoppedStack.includes(popoverDiv)) {
        return;
      }

      popoverDiv.style = "";
      this.#currentPoppedStack.push(popoverDiv);
      this.#isFreezing = true; // to freeze other triggers.
    });

    // style logic
    triggerElement.addEventListener("mouseover", () => {
      if (this.#isFreezing) return;
      triggerElement.classList.add("drumkit-popover-trigger__hover");
    });
    triggerElement.addEventListener("mouseleave", () => {
      triggerElement.classList.remove("drumkit-popover-trigger__hover");
    });

    this.#registeredPopovers.set(triggerElement, popoverDiv);
  };
}

const manager = new PopoverManager();

manager.registerPopoverOnClick(
  document.querySelector("#save-preset-btn"),
  document.querySelector("#save-preset-popover"),
);
manager.registerPopoverOnClick(
  document.querySelector("#load-preset-btn"),
  document.querySelector("#load-preset-popover"),
);

manager.registerPopoverOnClick(
  document.querySelector("#drumkit-popover-trigger-snare"),
  document.querySelector("#drumkit-snare-popover"),
);
manager.registerPopoverOnClick(
  document.querySelector("#drumkit-popover-trigger-hihat"),
  document.querySelector("#drumkit-hihat-popover"),
);
manager.registerPopoverOnClick(
  document.querySelector("#drumkit-popover-trigger-crash"),
  document.querySelector("#drumkit-crash-popover"),
);
manager.registerPopoverOnClick(
  document.querySelector("#drumkit-popover-trigger-tom1"),
  document.querySelector("#drumkit-tom1-popover"),
);
manager.registerPopoverOnClick(
  document.querySelector("#drumkit-popover-trigger-tom2"),
  document.querySelector("#drumkit-tom2-popover"),
);
manager.registerPopoverOnClick(
  document.querySelector("#drumkit-popover-trigger-tom3"),
  document.querySelector("#drumkit-tom3-popover"),
);
manager.registerPopoverOnClick(
  document.querySelector("#drumkit-popover-trigger-kick"),
  document.querySelector("#drumkit-kick-popover"),
);
manager.registerPopoverOnClick(
  document.querySelector("#drumkit-popover-trigger-ride"),
  document.querySelector("#drumkit-ride-popover"),
);
