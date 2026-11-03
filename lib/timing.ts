// Server-only per-request clock: every widget in one request measures against the same t0.
import "server-only";
import { cache } from "react";
import type { Timed } from "./types";

const requestStart = cache(() => performance.now());

export const since = () => Math.round(performance.now() - requestStart());

export const stamp = ({ startedAt, resolvedAt }: Timed<unknown>) =>
  `start +${startedAt}ms · done +${resolvedAt}ms`;
