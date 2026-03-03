import { SummaryResult } from "@/shared/types/chat";
import { useState } from "react";
import { summarizeAudioAction } from "../actions/summarize";

const useSummary = () => {
  const [summarizing, setSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(
    null,
  );
  const summary = async (audioBlob: Blob) => {
    setSummarizing(true);
    setSummaryResult(null);
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.mp3");
    const result = await summarizeAudioAction(formData);
    setSummaryResult(result);
    setSummarizing(false);
  };
  const reset = () => {
    setSummarizing(false);
    setSummaryResult(null);
  };
  return {
    summary,
    reset,
    summarizing,
    summaryResult,
  };
};
export default useSummary;
