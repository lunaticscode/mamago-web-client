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

self.onmessage = async (event) => {
  const { type, payload } = event.data;
  try {
    if (type === "WEBM_TO_MP3") {
      if (!ffmpegLoaded) return;
      const { inputName, inputBytes, bitrateKbps = 192 } = payload;
      await ffmpeg.writeFile(inputName, new Uint8Array(inputBytes));
      const outputName = inputName.replace(/\.webm$/i, "") + ".mp3";
      await ffmpeg.exec([
        "-i",
        inputName,
        "-vn",
        "-b:a",
        `${bitrateKbps}k`,
        outputName,
      ]);
      const out = await ffmpeg.readFile(outputName);
      const buf = out.buffer.slice(
        out.byteOffset,
        out.byteOffset + out.byteLength,
      );

      postMessage(
        {
          type: "DONE",
          payload: { outputName, mp3Bytes: buf, at: Date.now() },
        },
        [buf],
      );
      return;
    }
  } catch (err) {
    postMessage({
      type: "ERROR",
      payload: { message: String(err?.message || err) },
    });
  }
};
