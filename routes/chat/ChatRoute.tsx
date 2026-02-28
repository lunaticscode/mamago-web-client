import { ChatType } from "@/shared/types/chat";
import ChatContainer from "@/widgets/containers/chat-page/ChatContainer";
import { FC } from "react";

interface ChatRouteProps {
  chatType: ChatType;
}
const ChatRoute: FC<ChatRouteProps> = ({ chatType }) => {
  return <ChatContainer chatType={chatType} />;
};
export default ChatRoute;
