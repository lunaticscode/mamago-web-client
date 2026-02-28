"use client";

import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import useChatHistories from "./useChatHistories";

interface SidebarHeaderProps {
  children?: ReactNode;
}
const SidebarHeader: FC<SidebarHeaderProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
      {children}
    </div>
  );
};

interface SidebarContentProps {
  children?: ReactNode;
}

const SidebarContent: FC<SidebarContentProps> = ({ children }) => {
  return <div className="flex-1 overflow-y-auto px-2 py-2">{children}</div>;
};

interface SidebarGroupProps {
  children?: ReactNode;
  label: string;
}
const SidebarGroup: FC<SidebarGroupProps> = ({ children, label }) => {
  return (
    <div>
      <div className="px-2 py-2 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

interface SidebarMenuProps {
  label: string;
  id: string;
  active?: boolean;
  onClickMenu?: (id: string) => void;
}

const SidebarMenu: FC<SidebarMenuProps> = (props) => {
  const { label, id, active, onClickMenu } = props;
  return (
    <button
      onClick={() => onClickMenu?.(id)}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
    >
      {label}
    </button>
  );
};

const HistorySidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { histories } = useChatHistories();
  const router = useRouter();
  const pathname = usePathname();

  const handleClickHistory = (chatId: string) => {
    if (pathname.startsWith(`/chat/${chatId}`)) return;
    router.push(`/chat/${chatId}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle button - always visible at top-left */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-3 left-3 z-40 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 text-foreground"
          aria-label="메뉴 열기"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Overlay dim */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-sidebar z-50 flex flex-col border-r border-sidebar-border transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarHeader>
          <div
            onClick={() => router.push("/")}
            className="text-sm font-semibold text-sidebar-foreground"
          >
            Home
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            aria-label="메뉴 닫기"
          >
            <X size={18} />
          </button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="지난 기록">
            {histories.map((history, index) => (
              <SidebarMenu
                key={`${history.id}-${index}`}
                label={history.title}
                id={history.id}
                active={pathname.startsWith(`/chat/${history.id}`)}
                onClickMenu={handleClickHistory}
              />
            ))}
          </SidebarGroup>
        </SidebarContent>
      </aside>
    </>
  );
};
export default HistorySidebar;
