export class SavePresetComponent {
  #popover;

  #nameInput;

  #colorInput;

  #confirmButton;

  #cancelButton;

  constructor(
    savePresetPopover,
    nameInput,
    colorInput,
    confirmButton,
    cancelButton,
  ) {
    this.#popover = savePresetPopover;
    this.#nameInput = nameInput;
    this.#colorInput = colorInput;
    this.#confirmButton = confirmButton;
    this.#cancelButton = cancelButton;
  }

  get popover() {
    return this.#popover;
  }

  get nameInput() {
    return this.#nameInput;
  }

  get colorInput() {
    return this.#colorInput;
  }

  get confirmButton() {
    return this.#confirmButton;
  }

  get cancelButton() {
    return this.#cancelButton;
  }
}
