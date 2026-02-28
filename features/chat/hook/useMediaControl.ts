import { ChatType } from "@/shared/types/chat";
import { getMediastream } from "@/shared/utils/media";
import { useEffect, useRef, useState } from "react";

type RecordStatus = "idle" | "recording" | "paused" | "stopped";
const useMediaControl = (type: ChatType) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediastreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<RecordStatus>("idle");
  const [permission, setPermission] = useState(true);

  // type = realtime일 때는,
  // handleRecorderAvailable에서 서버로 blob 즉시 전송..?

  const handleRecorderAvailable = (e: BlobEvent) => {
    if (e.data.size) {
      chunksRef.current.push(e.data);
    }
  };

  const handleRecorderStopped = () => {
    const mergedBlob = new Blob(chunksRef.current, {
      type: "audio/webm",
    });
    setAudioBlob(mergedBlob);
    chunksRef.current = [];
  };

  const cleanupMedia = () => {
    mediaRecorderRef.current?.stop();
    mediastreamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const play = () => {
    if (!mediaRecorderRef.current) return;
    if (status === "paused") {
      mediaRecorderRef.current.resume();
    } else {
      mediaRecorderRef.current.start();
    }
    setStatus("recording");
  };
  const pause = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.pause();
    setStatus("paused");
  };
  const stop = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    if (!mediastreamRef.current) return;
    mediastreamRef.current.getTracks().forEach((t) => t.stop());
    setStatus("stopped");
  };

  const initMediaRecorder = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = handleRecorderAvailable;
    mediaRecorder.onstop = handleRecorderStopped;

    mediaRecorderRef.current = mediaRecorder;
  };

  const setupMediaRecorder = async () => {
    const mediaStream = (await getMediastream()) ?? null;
    if (mediaStream) {
      mediastreamRef.current = mediaStream;
      initMediaRecorder(mediaStream);
    } else {
      setPermission(false);
    }
  };

  useEffect(() => {
    setupMediaRecorder();
    return () => {
      cleanupMedia();
    };
  }, []);

  return {
    play,
    pause,
    stop,
    status,
    audioBlob,
    permission,
  };
};
export default useMediaControl;
