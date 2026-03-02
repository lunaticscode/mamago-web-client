"use client";
import {
  PlayCircle,
  PauseCircle,
  StopCircle,
  MicOff,
  Mic,
  Languages,
  RotateCcw,
  Download,
} from "lucide-react";
import useMediaControl from "../hook/useMediaControl";
import { ChatType } from "@/shared/types/chat";
import { FC, useMemo } from "react";
import useFfmpegWorker from "../hook/useFfmpegWorker";

interface MediaControllerProps {
  chatType: ChatType;
}
const MediaController: FC<MediaControllerProps> = ({ chatType }) => {
  const {
    permission,
    status,
    play,
    pause,
    stop,
    reset,
    ffmpegReady,
    audioBlob,
    audioUrl,
    converting,
    convertingError,
  } = useMediaControl(chatType);

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

  const handleTranslate = () => {
    if (!audioBlob) return;
    // convertToMp3(audioBlob);
  };

  if (isStopped && audioUrl) {
    return (
      <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-4 mb-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/10">
          {/* Audio preview */}
          <div className="px-4 pt-4">
            <audio src={audioUrl} controls className="w-full h-10" />
          </div>
          {converting && (
            <div className="flex items-center justify-center gap-2 px-4 pt-3">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-medium">
                MP3 변환 중...
              </span>
            </div>
          )}
          {/* Error */}
          {convertingError && (
            <div className="flex items-center justify-center px-4 pt-3">
              <span className="text-xs text-destructive font-medium">
                변환 실패: {convertingError}
              </span>
            </div>
          )}
          {/* Conversion complete */}
          {audioUrl && (
            <div className="flex items-center justify-center gap-2 px-4 pt-3">
              <span className="text-xs text-green-500 font-medium">
                MP3 변환 완료
              </span>
              <a
                href={audioUrl}
                download="recording.mp3"
                className="flex items-center gap-1 text-xs text-green-500 font-medium hover:text-green-400 transition-colors"
              >
                <Download size={14} />
                다운로드
              </a>
            </div>
          )}
          {/* Action buttons */}
          <div className="flex items-center gap-3 px-4 py-4">
            <button
              onClick={reset}
              disabled={converting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-accent transition-colors disabled:opacity-40"
            >
              <RotateCcw size={16} />
              다시 녹음
            </button>
            <button
              onClick={handleTranslate}
              disabled={!ffmpegReady || converting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              <Languages size={16} />
              {converting ? "변환 중..." : "번역 시작"}
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
