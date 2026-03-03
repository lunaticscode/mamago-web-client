export type ChatHistory = {
  id: string;
  title: string;
};

export type ChatType = "record" | "realtime";

export type SummaryResponse = {
  original: string;
  summary: string;
};

export type SummaryErrorResponse = {
  error: { code: string; message: string };
};

export type SummaryResult =
  | { success: true; data: SummaryResponse }
  | { success: false; error: string };
