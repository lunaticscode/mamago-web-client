"use client";

import { ChatHistory } from "@/shared/types/chat-history";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useState } from "react";
import useChatHistories from "./useChatHistories";
interface SidebarHeaderProps {
  children?: ReactNode;
}
const SidebarHeader: FC<SidebarHeaderProps> = ({ children }) => {
  return <div>{children}</div>;
};

interface SidebarContentProps {
  children?: ReactNode;
}

const SidebarContent: FC<SidebarContentProps> = ({ children }) => {
  return <div>{children}</div>;
};

interface SidebarGroupProps {
  children?: ReactNode;
  label: string;
}
const SidebarGroup: FC<SidebarGroupProps> = ({ children, label }) => {
  return (
    <div>
      <div>{label}</div>
      <div>{children}</div>
    </div>
  );
};

interface SidebarMenuProps {
  label: string;
  id: string;
  onClickMenu?: (id: string) => void;
}

const SidebarMenu: FC<SidebarMenuProps> = (props) => {
  const { label, id, onClickMenu } = props;
  return <div onClick={() => onClickMenu?.(id)}>{label}</div>;
};

interface HistorySidebarProps {}

const HistorySidebar: FC<HistorySidebarProps> = () => {
  const { histories } = useChatHistories();
  const router = useRouter();
  const pathname = usePathname();
  const handleClickHistory = (chatId: string) => {
    if (pathname.startsWith(`/chat/${chatId}`)) return;
    router.push(`/chat/${chatId}`);
  };
  return (
    <aside>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup label="지난 기록">
          {histories.map((history, index) => (
            <SidebarMenu
              key={`${history.id}-${index}`}
              label={history.title}
              id={history.id}
              onClickMenu={handleClickHistory}
            />
          ))}
        </SidebarGroup>
      </SidebarContent>
    </aside>
  );
};
export default HistorySidebar;
