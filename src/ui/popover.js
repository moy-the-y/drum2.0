class PopoverManager {
  #currentPoppedStack = new Array();
  #registeredPopovers = new Map(); // trigger : popover

  #isFreezing = false;

  constructor() {
    this.#setPreventDefault();
  }

  #setPreventDefault() {
    [...document.querySelectorAll("select")].forEach((select) => {
      select.addEventListener("keydown", (ev) => {
        ev.preventDefault();
      });
    });
  }

  #closeByClickOutside = (triggerEvent) => {
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

    this.#closePopover();
  };

  #closeByClickCancel = () => {
    this.#closePopover();
  };

  #closeByClickConfirm = () => {
    this.#closePopover();
  };

  #closePopover = () => {
    this.#currentPoppedStack.pop().style = "display:none";
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

      // this prevent the 'double click through', since the first one triggered will immediately make the rest early-returned.
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
      triggerElement.classList.add("drumpart-pop-trigger__hover");
    });
    triggerElement.addEventListener("mouseleave", () => {
      triggerElement.classList.remove("drumpart-pop-trigger__hover");
    });

    this.#registeredPopovers.set(triggerElement, popoverDiv);
  };

  // called after all popovers have been registered
  registerCancelButtons() {
    // close by clicking 'X' button
    for (const popover of this.#registeredPopovers.values()) {
      const cancelButton = popover.querySelector("#cancel");
      if (!cancelButton) {
        continue;
      }

      cancelButton.addEventListener("click", () => {
        this.#closeByClickCancel();
      });
    }

    // close by clicking '🗸' button
    for (const popover of this.#registeredPopovers.values()) {
      const confirmButton = popover.querySelector("#confirm");
      if (!confirmButton) {
        continue;
      }

      confirmButton.addEventListener("click", () => {
        this.#closeByClickConfirm();
      });
    }
  }

  registerDrumpartTriggers() {
    const baseZ = getComputedStyle(document.documentElement).getPropertyValue(
      "--drumpart-pop-trigger-zIndex",
    );
    const tom1Adjust = 1;
    const tom2Adjust = tom1Adjust;

    const tom1Trigger = document.querySelector("#drumpart-pop-trigger-tom1");
    tom1Trigger.style.zIndex = baseZ + tom1Adjust;
    const tom2Trigger = document.querySelector("#drumpart-pop-trigger-tom2");
    tom2Trigger.style.zIndex = baseZ + tom2Adjust;

    manager.registerPopoverOnClick(
      document.querySelector("#drumpart-pop-trigger-kick"),
      document.querySelector("#drumkit-kick-popover"),
    );
    manager.registerPopoverOnClick(
      document.querySelector("#drumpart-pop-trigger-snare"),
      document.querySelector("#drumkit-snare-popover"),
    );
    manager.registerPopoverOnClick(
      document.querySelector("#drumpart-pop-trigger-hihat-open"),
      document.querySelector("#drumkit-hihat-open-popover"),
    );
    manager.registerPopoverOnClick(
      document.querySelector("#drumpart-pop-trigger-hihat-close"),
      document.querySelector("#drumkit-hihat-close-popover"),
    );
    manager.registerPopoverOnClick(
      document.querySelector("#drumpart-pop-trigger-crash"),
      document.querySelector("#drumkit-crash-popover"),
    );
    manager.registerPopoverOnClick(
      tom1Trigger,
      document.querySelector("#drumkit-tom1-popover"),
    );
    manager.registerPopoverOnClick(
      document.querySelector("#drumpart-pop-trigger-tom3"),
      document.querySelector("#drumkit-tom3-popover"),
    );
    manager.registerPopoverOnClick(
      document.querySelector("#drumpart-pop-trigger-ride"),
      document.querySelector("#drumkit-ride-popover"),
    );
    manager.registerPopoverOnClick(
      tom2Trigger,
      document.querySelector("#drumkit-tom2-popover"),
    );
  }
}

// register listener code
const manager = new PopoverManager();

manager.registerPopoverOnClick(
  document.querySelector("#save-preset-button"),
  document.querySelector("#save-preset-popover"),
);
manager.registerPopoverOnClick(
  document.querySelector("#load-preset-button"),
  document.querySelector("#load-preset-popover"),
);

manager.registerDrumpartTriggers();
manager.registerCancelButtons();
