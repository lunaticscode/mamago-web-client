import ChatDetailRoute from "@/routes/chat/ChatDetailRoute";

type ChatDetailPageProps = {
  params: Promise<{ id: string }>;
};
const ChatDetailPage = async ({ params }: ChatDetailPageProps) => {
  const id = (await params).id;
  return <ChatDetailRoute id={id} />;
};
export default ChatDetailPage;
