import { FFmpeg } from "/ffmpeg-assets/ffmpeg/package/dist/esm/index.js";
import { toBlobURL } from "/ffmpeg-assets/util/package/dist/esm/index.js";

let ffmpeg = new FFmpeg();
let ffmpegLoaded = false;
const coreBase = "/ffmpeg-assets/core/package/dist/esm";

const load = async () => {
  if (ffmpegLoaded) {
    console.log("Already ffmpeg loaded");
    return;
  }

  const coreURL = await toBlobURL(
    `${coreBase}/ffmpeg-core.js`,
    "text/javascript",
  );
  const wasmURL = await toBlobURL(
    `${coreBase}/ffmpeg-core.wasm`,
    "application/wasm",
  );
  // console.log(coreURL, wasmURL);

  await ffmpeg.load({ coreURL, wasmURL });
  // console.log(ffmpeg); // ffmpeg.loaded = true
  ffmpegLoaded = ffmpeg.loaded;

  //   console.log(coreURL, wasmURL, workerURL);
  self.postMessage({
    type: "WORKER-LOADED",
    payload: { at: Date.now(), message: "Success to load ffmpeg" },
  });
};

load();
