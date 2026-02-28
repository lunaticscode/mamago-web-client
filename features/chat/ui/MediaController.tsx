"use client";
import {
  PlayCircle,
  PauseCircle,
  StopCircle,
  MicOff,
  Mic,
  Languages,
  RotateCcw,
} from "lucide-react";
import useMediaControl from "../hook/useMediaControl";
import { ChatType } from "@/shared/types/chat";
import { FC, useMemo } from "react";

interface MediaControllerProps {
  chatType: ChatType;
}
const MediaController: FC<MediaControllerProps> = ({ chatType }) => {
  const { permission, status, play, pause, stop, reset, audioBlob, audioUrl } =
    useMediaControl(chatType);

  if (!permission) {
    return (
      <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-4 mb-4 bg-destructive/10 backdrop-blur-xl border border-destructive/30 rounded-2xl shadow-lg shadow-black/10">
          <div className="flex items-center justify-center gap-3 py-4 text-destructive">
            <MicOff size={20} />
            <span className="text-sm font-medium">
              마이크 권한이 필요합니다
            </span>
          </div>
        </div>
      </div>
    );
  }

  const [isIdle, isRecording, isPaused, isStopped] = useMemo(
    () => [
      status === "idle",
      status === "recording",
      status === "paused",
      status === "stopped",
    ],
    [status],
  );

  const [playDisabled, pauseDisabled, stopDisabled] = useMemo(
    () => [isRecording || isStopped, !isRecording, isIdle || isStopped],
    [isRecording, isStopped, isIdle],
  );

  const handleTranslate = () => {
    if (!audioBlob) return;
    // TODO: audioBlob을 서버로 전송
    console.log({ audioBlob });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
  };

  if (isStopped && audioUrl) {
    return (
      <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-4 mb-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/10">
          {/* Audio preview */}
          <div className="px-4 pt-4">
            <audio src={audioUrl} controls className="w-full h-10" />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 px-4 py-4">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
            >
              <RotateCcw size={16} />
              다시 녹음
            </button>
            <button
              onClick={handleTranslate}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Languages size={16} />
              번역 시작
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-4 mb-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/10">
        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center justify-center gap-2 pt-3">
            <span className="size-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs text-destructive font-medium">
              녹음 중
            </span>
          </div>
        )}
        {isPaused && (
          <div className="flex items-center justify-center gap-2 pt-3">
            <span className="size-2 rounded-full bg-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              일시정지
            </span>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 py-4">
          {/* Play / Resume */}
          <button
            onClick={play}
            disabled={playDisabled}
            className={`transition-colors ${
              playDisabled
                ? "text-muted-foreground/40"
                : "text-foreground/80 hover:text-primary active:scale-95"
            }`}
          >
            {isIdle ? <Mic size={32} /> : <PlayCircle size={32} />}
          </button>

          {/* Pause */}
          <button
            onClick={pause}
            disabled={pauseDisabled}
            className={`transition-colors ${
              isPaused
                ? "text-primary"
                : pauseDisabled
                  ? "text-muted-foreground/40"
                  : "text-foreground/80 hover:text-primary active:scale-95"
            }`}
          >
            <PauseCircle size={32} />
          </button>

          {/* Stop */}
          <button
            onClick={stop}
            disabled={stopDisabled}
            className={`transition-colors ${
              stopDisabled
                ? "text-muted-foreground/40"
                : "text-destructive/80 hover:text-destructive active:scale-95"
            }`}
          >
            <StopCircle size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default MediaController;
