const INTERVAL_MS = 67;
const DISPLACEMENT_PX_NORMAL = 2;
const DISPLACEMENT_PX_SLOW = 0.5;

const tickerText = document.querySelector("#ticker__text");
const leftCover = document.querySelector("#ticker__cover-left");
const rightCover = document.querySelector("#ticker__cover-right");

let positionX;
let displacement_px = DISPLACEMENT_PX_NORMAL;

init();
doTaskEachFrame();

function doTaskEachFrame() {
  const textWidth = tickerText.getBoundingClientRect().width;
  const scrollEndX =
    leftCover.getBoundingClientRect().x +
    leftCover.getBoundingClientRect().width;

  // update state
  positionX = positionX - displacement_px;
  if (positionX + textWidth <= scrollEndX) {
    const scrollStartX = rightCover.getBoundingClientRect().x;
    positionX = scrollStartX;
  }

  // update element
  tickerText.style.left = positionX + "px";

  // arrange the same task to the next frame
  requestAnimationFrame(doTaskEachFrame);
}

function init() {
  const scrollStartX = rightCover.getBoundingClientRect().x;
  positionX = scrollStartX;
  tickerText.style.left = scrollStartX + "px";

  document
    .querySelector("#ticker-container")
    .addEventListener("mouseover", () => {
      displacement_px = DISPLACEMENT_PX_SLOW;
    });
  document
    .querySelector("#ticker-container")
    .addEventListener("mouseleave", () => {
      displacement_px = DISPLACEMENT_PX_NORMAL;
    });
}
