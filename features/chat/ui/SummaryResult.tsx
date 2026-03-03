import { SummaryResult as SummaryResultType } from "@/shared/types/chat";
import { FC } from "react";

interface SummaryResultProps {
  summarizing: boolean;
  result: SummaryResultType | null;
}

const SummaryResult: FC<SummaryResultProps> = ({ summarizing, result }) => {
  if (summarizing) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 pb-4">
        <span className="size-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs text-primary font-medium">요약 중...</span>
      </div>
    );
  }

  if (result && !result.success) {
    return (
      <div className="px-4 pb-4">
        <p className="text-xs text-destructive font-medium">{result.error}</p>
      </div>
    );
  }

  if (result?.success) {
    return (
      <div className="px-4 pb-4 space-y-3">
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">
            원본 텍스트
          </p>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {result.data.original}
          </p>
        </div>
        <div className="rounded-xl bg-primary/10 p-3">
          <p className="text-xs font-semibold text-primary mb-1">요약</p>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {result.data.summary}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default SummaryResult;
