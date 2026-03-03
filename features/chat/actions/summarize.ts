"use server";

import { SummaryResult } from "@/shared/types/chat";

const DEFAULT_SUMMARIZE_ERROR_MESSAGE = "요약 요청에 실패했습니다";
export async function summarizeAudioAction(
  formData: FormData,
): Promise<SummaryResult> {
  const baseUrl = process.env.API_BASE_URL || "http://localhost:8001";
  try {
    const res = await fetch(`${baseUrl}/chats/summary`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return {
        success: false,
        error: errorData?.error?.message || DEFAULT_SUMMARIZE_ERROR_MESSAGE,
      };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: DEFAULT_SUMMARIZE_ERROR_MESSAGE };
  }
}
