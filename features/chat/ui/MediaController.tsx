"use client";
import { PlayCircle, PauseCircle, StopCircle } from "lucide-react";
import useMediaControl from "../hook/useMediaControl";
import { ChatType } from "@/shared/types/chat";
import { FC } from "react";

interface MediaControllerProps {
  chatType: ChatType;
}
const MediaController: FC<MediaControllerProps> = ({ chatType }) => {
  const { permission, status, play, pause, stop } = useMediaControl(chatType);

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-4 mb-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/10">
        <div className="flex items-center justify-center gap-6 py-4">
          <button className="text-foreground/80 hover:text-foreground transition-colors">
            <PlayCircle size={32} />
          </button>
          <button className="text-foreground/80 hover:text-foreground transition-colors">
            <PauseCircle size={32} />
          </button>
          <button className="text-foreground/80 hover:text-foreground transition-colors">
            <StopCircle size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default MediaController;
