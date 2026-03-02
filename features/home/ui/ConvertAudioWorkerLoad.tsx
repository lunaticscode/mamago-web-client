"use client";
import { useEffect, useRef } from "react";
type WorkerResponse = {
  type: "WORKER-LOAD";
  payload: { received: { msg: string }; at: number };
};

const ConvertAudioWorkerLoad = () => {
  const workerRef = useRef<Worker>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const workerUrl = "/workers/ffmpeg-worker.js";
    const worker = new Worker(workerUrl, { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      console.log(event.data);
    };
  }, []);

  return (
    <div className="text-center mt-2 mb-2">
      <h2>AudioWorkerLoad</h2>
    </div>
  );
};
export default ConvertAudioWorkerLoad;
