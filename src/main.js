import { triggerRandomAnimation } from "./animation-trigger.js";
import "./ticker.js";
import "./popover.js";

const auctx = new AudioContext();
// create and set up gain node
const gain = auctx.createGain();
gain.connect(auctx.destination);

// make sure each asset filename is the same as keyMap value name and soundMap key name
const keyMap = initKeyMap();
const soundMapList = await initSoundMapList();
let currentUsedSoundMap = 0;

// keyboard
const animationTarget = document.querySelector("#animation-wrapper");
window.addEventListener("keydown", keyboardInputHandler);

// volume
const volumeSlider = document.querySelector("#volume-slider");
volumeSlider.addEventListener("input", volumeChangeHandler);

function initKeyMap() {
  return new Map([
    ["A", "snare"],
    ["S", "snare"],
    ["Z", "bass"],
    ["X", "bass"],
    ["W", "open-hat"],
    ["E", "open-hat"],
    ["R", "closed-hat"],
    ["T", "closed-hat"],
    ["Y", "crash"],
    ["U", "ride"],
    ["G", "high-tom"],
    ["H", "mid-tom"],
    ["J", "floor-tom"],
  ]);
}

async function initSoundMapList(drumkitDirectoryName, fileExtensionStr) {
  const soundMapList = [];

  const setList = [
    ["res/audio/rock", ".mp3"],
    ["res/audio/punk", ".wav"],
  ];
  for (const setInfo of setList) {
    const map = new Map();

    for await (const kv of keyMap.entries()) {
      const name = kv[1];
      const filename = "./" + setInfo[0] + "/" + name + setInfo[1];
      map.set(
        name,
        buildPlaySoundFn(auctx, await getBuffer(auctx, filename), gain),
      );
    }

    soundMapList.push(map);
  }

  return soundMapList;
}

/**
 *
 * @param {KeyboardEvent} ev
 */
async function keyboardInputHandler(ev) {
  // dealing with autoplay policy
  if (auctx.state === "suspended") {
    await auctx.resume(); // state resumes to running
  }
  const playSoundFn = soundMapList[currentUsedSoundMap].get(
    keyMap.get(ev.key.toUpperCase()),
  );
  playSoundFn();
}

function volumeChangeHandler() {
  const value = volumeSlider.value;
  gain.gain.setValueAtTime(value, auctx.currentTime);
}

function buildPlaySoundFn(audioContext, audioBuffer, gainNode) {
  return () => {
    const source = new AudioBufferSourceNode(audioContext, {
      buffer: audioBuffer,
    });
    source.connect(gainNode);
    source.start();
  };
}

/**
 *
 * @param {AudioContext} auctx
 * @param {*} filePath
 * @returns {AudioBuffer}
 */
async function getBuffer(auctx, filePath) {
  try {
    const res = await fetch(filePath);
    const buffer = await res.arrayBuffer();
    return await auctx.decodeAudioData(buffer);
  } catch (error) {
    console.debug("[debug]", error);
  }
}
