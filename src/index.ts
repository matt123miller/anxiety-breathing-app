// Breathe timer stuff

let breatheInSeconds = 4000;
let holdSeconds = 4000;
let breatheOutSeconds = 6000;
let totalBreathCycles = 5;
let currentBreathingCycle = 0;

let breatheInTimeout: number, holdTimeout: number, breatheOutTimout: number;

// html elements

const breatheInInput = document.getElementById(
  "breathe-in-seconds"
) as HTMLInputElement;
const holdInput = document.getElementById("hold-seconds") as HTMLInputElement;
const breatheOutInput = document.getElementById(
  "breathe-out-seconds"
) as HTMLInputElement;
const totalBreatheCyclesInput = document.getElementById(
  "breathe-cycles"
) as HTMLInputElement;
const currentInstruction = document.getElementById(
  "current-instruction"
) as HTMLDivElement;
const startButton = document.getElementById("start-button") as HTMLDivElement;
const breatheVideoElem = document.getElementById(
  "breathe-video"
) as HTMLVideoElement;

// events

breatheInInput.addEventListener("change", (ev: Event) => {
  // @ts-ignore
  breatheInSeconds = ev.target.value * 1000;
});

holdInput.addEventListener("change", (ev: Event) => {
  // @ts-ignore
  holdSeconds = ev.target.value * 1000;
});

breatheOutInput.addEventListener("change", (ev: Event) => {
  // @ts-ignore
  breatheOutSeconds = ev.target.value * 1000;
});

totalBreatheCyclesInput.addEventListener("change", (ev: Event) => {
  // @ts-ignore
  totalBreathCycles = ev.target.value;
});

startButton.addEventListener("click", (ev: Event) => {
  stopBreathing();
  startBreathingExercise();
});

/**
 *
 * @param breathingSeconds the total milliseconds that the next segment should take.
 * @returns A value between 0 and Infinity. e.g. 0.5 is half speed. 2 is double speed.
 */
function computePlaybackRate(breatheSeconds: number): number {
  // We know the video's length is 4 seconds ish. Lets say 4.
  // 2 seconds for breathing in
  // 2 seconds for breathing out

  // normal playback speed = 1;
  // half speed = 0.5;
  // double speed = 2;

  // 1 second duration
  // 2000 / 1000
  // 4 second duration
  // 2000 / 4000
  // 6 second duration
  // 2000 / 6000
  // 0.5 second duration
  // 2000 / 500

  const videoSegmentDuration = 2000;

  return videoSegmentDuration / breatheSeconds;
}

// This timneout based solution does work but is a bit ugly and maybe,
// eventually, the call stack will overflow.
function startBreathingExercise() {
  breatheVideoElem.currentTime = 0;
  breatheVideoElem.playbackRate = computePlaybackRate(breatheInSeconds);
  breatheVideoElem.play();

  breatheInTimeout = setTimeout(() => {
    breatheVideoElem.pause();
    holdTimeout = setTimeout(() => {
      breatheVideoElem.playbackRate = computePlaybackRate(breatheOutSeconds);
      breatheVideoElem.play();

      breatheOutTimout = setTimeout(() => {
        stopBreathing();
      }, breatheOutSeconds);
    }, holdSeconds);
  }, breatheInSeconds);
}

function stopBreathing() {
  clearTimeout(breatheInTimeout);
  clearTimeout(holdTimeout);
  clearTimeout(breatheOutTimout);

  if (currentBreathingCycle < totalBreathCycles) {
    currentBreathingCycle++;
    startBreathingExercise();
  } else {
    currentBreathingCycle = 0;
  }
}
