import { useCallback, useEffect, useRef, useState } from "react";

type FfmpegWorkerResponse =
  | { type: "WORKER-LOADED"; payload: { at: number; message: string } }
  | {
      type: "DONE";
      payload: { outputName: string; mp3Bytes: ArrayBuffer; at: number };
    }
  | { type: "ERROR"; payload: { message: string } };

const useFfmpegWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [converting, setConverting] = useState(false);
  const [mp3Blob, setMp3Blob] = useState<Blob | null>(null);
  const [mp3Url, setMp3Url] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const worker = new Worker("/workers/ffmpeg-worker.js", { type: "module" });
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<FfmpegWorkerResponse>) => {
      const { type, payload } = event.data;
      console.log(type, payload);
      switch (type) {
        case "WORKER-LOADED":
          setFfmpegReady(true);
          break;
        case "DONE": {
          const blob = new Blob([payload.mp3Bytes], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          setMp3Blob(blob);
          setMp3Url((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
          setConverting(false);
          break;
        }
        case "ERROR":
          setError(payload.message);
          setConverting(false);
          break;
      }
    };

    worker.onerror = (e) => {
      console.error("FFmpeg worker error:", e);
      setError("Worker load failed");
    };

    return () => {
      worker.terminate();
      setMp3Url((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  const convertToMp3 = useCallback(
    async (blob: Blob, fileName = "recording.webm") => {
      const worker = workerRef.current;
      //   console.log(blob, worker, ffmpegReady);
      if (!worker || !ffmpegReady) return;

      setConverting(true);
      setError(null);
      setMp3Blob(null);
      setMp3Url((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });

      const arrayBuffer = await blob.arrayBuffer();
      //   console.log({ arrayBuffer });
      worker.postMessage(
        {
          type: "WEBM_TO_MP3",
          payload: { inputName: fileName, inputBytes: arrayBuffer },
        },
        [arrayBuffer],
      );
    },
    [ffmpegReady],
  );

  return { ffmpegReady, converting, mp3Blob, mp3Url, error, convertToMp3 };
};

export default useFfmpegWorker;
