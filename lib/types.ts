// Shared types used by server data functions and the client Panel.
export type WidgetName = "revenue" | "customers" | "activity";

export type Timed<T> = { data: T; startedAt: number; resolvedAt: number };
