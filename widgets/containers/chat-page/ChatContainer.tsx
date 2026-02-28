import MediaController from "@/features/chat/ui/MediaController";
import { ChatType } from "@/shared/types/chat";
import Container from "@/widgets/layout/Container";
import { FC } from "react";

interface ChatContainerProps {
  chatType: ChatType;
}
const ChatContainer: FC<ChatContainerProps> = ({ chatType }) => {
  return (
    <Container>
      <MediaController chatType={chatType} />
    </Container>
  );
};
export default ChatContainer;
