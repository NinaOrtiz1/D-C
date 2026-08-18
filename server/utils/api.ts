export type ApiSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export function sendSuccess<T>(res: any, message: string, data: T) {
  return res.status(200).json({ success: true, message, data } satisfies ApiSuccessResponse<T>);
}

export function sendError(res: any, status: number, message: string) {
  return res.status(status).json({ success: false, message } satisfies ApiErrorResponse);
}

export function normalizeString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}
