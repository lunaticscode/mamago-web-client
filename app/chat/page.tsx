import ChatRoute from "@/routes/chat/ChatRoute";
import { ChatType } from "@/shared/types/chat";
import { FC } from "react";

interface ChatPageProps {
  searchParams: Promise<{ type: ChatType }>;
}

const ChatPage: FC<ChatPageProps> = async ({ searchParams }) => {
  const chatType = (await searchParams).type;
  return <ChatRoute chatType={chatType} />;
};
export default ChatPage;
