export { triggerRandomAnimation, triggerAnimation };

const animations = ["heartbeat"];
const sendedRequests = [];

/**
 *
 * @param {HTMLElement} element
 */
function triggerRandomAnimation(element) {
  triggerAnimation(element, animations[randInt(0, animations.length - 1)]);
}

function triggerAnimation(element, animationName) {
  if (sendedRequests.length >= 1) {
    // This could happen when user trigger two animations at one browser tick,
    // for example, by pressing two keys at once,
    // which will cause a glitch.
    return;
  }

  const classes = element.classList;
  for (const a of animations) {
    classes.remove(a);
  }

  sendedRequests.push(
    requestAnimationFrame(() => {
      classes.toggle(animationName);
      sendedRequests.pop();
    }),
  );
}

function randInt(minIntIncluded, maxIntIncluded) {
  if (!Number.isInteger(minIntIncluded) || !Number.isInteger(maxIntIncluded)) {
    throw new TypeError(
      `Invalid argument error: both arguments has to be integer.`,
    );
  }

  if (minIntIncluded > maxIntIncluded) {
    throw new TypeError(
      `Invalid argument error: minIntIncluded has to be less or equal to maxIntIncluded`,
    );
  } else if (minIntIncluded === maxIntIncluded) {
    return minIntIncluded;
  }

  let mathR = Math.random();
  let decimalR = minIntIncluded + mathR * (maxIntIncluded - minIntIncluded);
  return Math.round(decimalR);
}
