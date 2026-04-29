class PopoverManager {
    #currentPoppedStack = new Array();
    #registeredPopovers = new Array();

    constructor() {
        // default close behavior
        window.addEventListener("click", (triggerEvent) => this.#closeLastPopover(triggerEvent));
    }

    #closeLastPopover = (triggerEvent) => {
        if (this.#currentPoppedStack.length === 0) {
            return;
        }

        // only close if triggered outside the current popover area to avoid conflict
        if (this.#currentPoppedStack.at(-1) === triggerEvent.target) {
            return;
        }

        const popover = this.#currentPoppedStack.pop();
        popover.style = "display:none";
    };

    addPopoverOnClick = (clickedElement, popoverDiv) => {
        clickedElement.addEventListener("click", (ev) => {
            popoverDiv.style = "";
            this.#currentPoppedStack.push(popoverDiv);
            ev.stopPropagation();
        });
        this.#registeredPopovers.push(popoverDiv);
    };
}

const manager = new PopoverManager();

manager.addPopoverOnClick(
    document.querySelector("#save-preset-btn"),
    document.querySelector("#save-preset-popover")
);
manager.addPopoverOnClick(
    document.querySelector("#load-preset-btn"),
    document.querySelector("#load-preset-popover")
);