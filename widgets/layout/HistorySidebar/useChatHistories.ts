import { ChatHistory } from "@/shared/types/chat-history";
import { useEffect, useState } from "react";

const DUMMY_HISTORIES: ChatHistory[] = [
  { title: "chat-history-1", id: "chat-history-1" },
  { title: "chat-history-2", id: "chat-history-2" },
];

const useChatHistories = () => {
  const [histories, setHistories] = useState<ChatHistory[]>(DUMMY_HISTORIES);

  const fetchHistories = () => {
    try {
    } catch (err) {}
  };
  useEffect(() => {
    fetchHistories();
  }, []);

  return {
    histories,
  };
};
export default useChatHistories;
