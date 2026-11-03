// Server-only mock data sources: each has its own latency and records when it started and resolved.
import "server-only";
import { connection } from "next/server";
import { since } from "./timing";
import type { Timed, WidgetName } from "./types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchMock<T>(
  name: WidgetName,
  ms: number,
  data: T,
): Promise<Timed<T>> {
  await connection();
  const startedAt = since();
  await sleep(ms);
  if (process.env.FAIL_WIDGET === name) throw new Error(`${name} failed`);
  const resolvedAt = since();
  console.log(`[${name}] start +${startedAt}ms, resolved +${resolvedAt}ms`);
  return { data, startedAt, resolvedAt };
}

export const getRevenue = () =>
  fetchMock("revenue", 300, [
    { day: "Mon", amount: 42 },
    { day: "Tue", amount: 58 },
    { day: "Wed", amount: 35 },
    { day: "Thu", amount: 71 },
    { day: "Fri", amount: 64 },
    { day: "Sat", amount: 88 },
    { day: "Sun", amount: 50 },
  ]);

export const getCustomers = () =>
  fetchMock("customers", 900, [
    { name: "Acme Corp", orders: 24, total: 12400 },
    { name: "Globex", orders: 18, total: 9800 },
    { name: "Initech", orders: 15, total: 7300 },
    { name: "Umbrella", orders: 11, total: 5600 },
    { name: "Hooli", orders: 9, total: 4100 },
  ]);

export const getActivity = () =>
  fetchMock("activity", 1800, [
    { id: 1, text: "Invoice #1042 paid", time: "2m ago" },
    { id: 2, text: "New signup: Globex", time: "9m ago" },
    { id: 3, text: "Refund issued #1031", time: "21m ago" },
    { id: 4, text: "Plan upgraded: Hooli", time: "1h ago" },
    { id: 5, text: "Invoice #1040 sent", time: "2h ago" },
    { id: 6, text: "Webhook retried", time: "3h ago" },
  ]);
