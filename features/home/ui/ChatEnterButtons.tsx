"use client";

import { Button } from "@/components/ui/button";
import { ChatType } from "@/shared/types/chat";
import { useRouter } from "next/navigation";

const ChatEnterButtons = () => {
  const router = useRouter();

  const handleEnterChatPage = (chatType: ChatType) => {
    router.push(`/chat?type=${chatType}`);
  };
  return (
    <div className="flex items-center justify-center gap-x-2 w-full">
      <Button onClick={() => handleEnterChatPage("record")}>
        녹음 후 번역
      </Button>
      <Button onClick={() => handleEnterChatPage("realtime")}>
        실시간 번역
      </Button>
    </div>
  );
};

export default ChatEnterButtons;
