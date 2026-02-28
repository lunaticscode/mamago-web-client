import { FC } from "react";

interface ChatDetailRouteProps {
  id: string;
}
const ChatDetailRoute: FC<ChatDetailRouteProps> = ({ id }) => {
  console.log({ id });
  return <></>;
};
export default ChatDetailRoute;
