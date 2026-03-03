import { MicOff } from "lucide-react";

const PermissionDenined = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-4 mb-4 bg-destructive/10 backdrop-blur-xl border border-destructive/30 rounded-2xl shadow-lg shadow-black/10">
        <div className="flex items-center justify-center gap-3 py-4 text-destructive">
          <MicOff size={20} />
          <span className="text-sm font-medium">마이크 권한이 필요합니다</span>
        </div>
      </div>
    </div>
  );
};

export default PermissionDenined;
