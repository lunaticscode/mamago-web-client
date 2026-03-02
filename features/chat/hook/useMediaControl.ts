import { ChatType } from "@/shared/types/chat";
import { getMediastream } from "@/shared/utils/media";
import { useCallback, useEffect, useRef, useState } from "react";
import useFfmpegWorker from "./useFfmpegWorker";

type RecordStatus = "idle" | "recording" | "paused" | "stopped";
const useMediaControl = (type: ChatType = "record") => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediastreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<RecordStatus>("idle");
  const [permission, setPermission] = useState(true);

  const {
    mp3Url,
    mp3Blob,
    convertToMp3,
    converting,
    ffmpegReady,
    error: convertingError,
  } = useFfmpegWorker();

  const convertToMp3Ref = useRef(convertToMp3);
  useEffect(() => {
    convertToMp3Ref.current = convertToMp3;
  }, [convertToMp3]);

  useEffect(() => {
    if (mp3Blob && mp3Url) {
      // console.log(mp3Blob, mp3Url);
      setAudioBlob(mp3Blob);
      setAudioUrl(mp3Url);
    }
  }, [mp3Blob, mp3Url]);

  const handleRecorderAvailable = (e: BlobEvent) => {
    if (e.data.size) {
      chunksRef.current.push(e.data);
    }
  };

  const handleRecorderStopped = () => {
    const mergedBlob = new Blob(chunksRef.current, {
      type: "audio/webm",
    });
    convertToMp3Ref.current(mergedBlob);
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

  const reset = () => {
    setStatus("idle");
    setAudioBlob(null);
    setAudioUrl(null);
    setupMediaRecorder();
  };

  useEffect(() => {
    setupMediaRecorder();
    return () => {
      cleanupMedia();
      setAudioUrl(null);
    };
  }, []);

  return {
    play,
    pause,
    stop,
    reset,
    status,
    audioBlob,
    audioUrl,
    permission,
    converting,
    convertingError,
    ffmpegReady,
  };
};
export default useMediaControl;
