"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
const MAX_LOG_LENGTH = 30;
type WorkerRequest =
  | { type: "PING"; payload: { msg: string } }
  | { type: "ECHO"; payload: unknown };

type WorkerResponse =
  | { type: "PONG"; payload: { received: { msg: string }; at: number } }
  | { type: "ECHO"; payload: unknown };

const TestWorkerLoad = () => {
  const workerRef = useRef<Worker | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const pushLog = (newLog: string) => {
    setLogs((prev) => [newLog, ...prev].slice(0, MAX_LOG_LENGTH));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const workerUrl = "/workers/test-worker.js";
    const worker = new Worker(workerUrl);
    workerRef.current = worker;
    console.log({ worker });
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      console.log(event);
      pushLog(`← ${JSON.stringify(event.data)}`);
    };

    worker.onerror = (err) => {
      pushLog(`Worker error: ${String(err.message || err)}`);
    };

    pushLog("Worker created ✅");
  }, []);

  const handlePing = (text: string) => {
    const w = workerRef.current;
    if (!w) return pushLog("Worker not ready");

    const msg: WorkerRequest = { type: "PING", payload: { msg: text } };
    pushLog(`→ ${JSON.stringify(msg)}`);
    w.postMessage(msg);
  };
  return (
    <div className="w-full text-center">
      <h2 className="text-center">WorkerLoad</h2>

      <div>
        <Button
          onClick={() =>
            handlePing(`ping message ${new Date().getTime().toString()}`)
          }
        >
          PING
        </Button>
      </div>
      {logs.map((l, i) => (
        <div key={`log-${i}`}>{l.toString()}</div>
      ))}
    </div>
  );
};
export default TestWorkerLoad;
