const savePresetPop = document.querySelector("#save-preset-popover");
const loadPresetPop = document.querySelector("#load-preset-popover");
const savePresetBtn = document.querySelector("#save-preset-btn");
const loadPresetBtn = document.querySelector("#load-preset-btn");

savePresetBtn.addEventListener("click", (ev) => {
    savePresetPop.style = "";
    savePresetBtn.disabled = true;
    loadPresetBtn.disabled = true;
    ev.stopPropagation();
});

loadPresetBtn.addEventListener("click", (ev) => {
    loadPresetPop.style = "";
    savePresetBtn.disabled = true;
    loadPresetBtn.disabled = true;
    ev.stopPropagation();
});

window.addEventListener("click", (ev) => {
    if (ev.target !== savePresetPop && ev.target !== loadPresetPop) {
        savePresetPop.style = "display:none";
        loadPresetPop.style = "display:none";
        savePresetBtn.disabled = false;
        loadPresetBtn.disabled = false;
    }
});