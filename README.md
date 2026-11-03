# Streaming Analytics Dashboard (Next.js 16 App Router)

A dashboard with three independent widgets (revenue chart, top-customers table, recent-activity feed).
Each widget fetches its own data on the server and streams in through its own `<Suspense>` boundary,
so the fast widgets never wait for the slow one.

Run: `npm i && npm run build && npm run start` (served locally with `next start`, not deployed).

## How parallelism works
- `app/page.tsx` contains no `await`. It places three `Panel`s, each with its own `<Suspense>`.
- Each widget is an async Server Component that awaits only its own data function
  (300 / 900 / 1800 ms, simulated with `setTimeout`).
- There is no outer Suspense around the group, so no widget waits on another.
- The shell (header, nav, page title) has no data dependency and renders immediately.
- Skeletons use the same `Card` frame and fixed `h-64` body as the real widgets, and each skeleton
  mirrors its widget's layout (bars, table rows, feed rows), so nothing shifts when content arrives.
- `data.ts` calls `connection()` so every request renders at request time. Without it, Next could
  prerender the page at build time and there would be nothing to stream.

## Timing evidence

### 1. Shared server clock
Each widget footer shows start and finish times measured against one per-request clock
(`React.cache` gives a single `t0` per request):

| Widget | start | done |
|---|---|---|
| Revenue | +0ms | +301ms |
| Customers | +0ms | +902ms |
| Activity | +0ms | +1801ms |

All three start at `+0ms` and finish at about their configured delay. The server terminal prints the
same lines:

```
[revenue] start +0ms, resolved +301ms
[customers] start +0ms, resolved +902ms
[activity] start +0ms, resolved +1801ms
```

### 2. Chunk arrival at the client (`node scripts/chunks.mjs`)
The script reads the streamed response and prints when each widget's HTML arrives.

Dashboard (`/`):
```
+361ms  widget with server done +301ms arrived
+964ms  widget with server done +901ms arrived
+1863ms  widget with server done +1801ms arrived
```

Parallel routes (`/slots`):
```
+376ms  widget with server done +300ms arrived
+971ms  widget with server done +900ms arrived
+1874ms  widget with server done +1801ms arrived
```

The fastest widget arrives about 1.5s before the slowest, and each chunk arrives at its configured
delay plus a constant 60 to 75 ms of transfer overhead. Arrival is driven by timing, not by a fixed
render order. Raw output: `public/proof/chunks.txt`.

### 3. Network tab
Screenshot: `public/proof/network.png` (Doc request selected, Timing tab open).

Widgets arrive as chunks of one streamed document, so the Network tab shows one long request, not
three. Its Timing tab shows a tiny TTFB followed by a ~1.8s Content Download, which is the streaming
signature. Per-widget timing comes from the shared server clock, `chunks.mjs` and the Timing tab.
Server Actions are serialized by Next, so refresh POSTs are not used as parallelism evidence.

### 4. Progressive rendering screenshots
| Time | Screenshot | What is visible |
|---|---|---|
| ~0.5s | `public/proof/t1.png` | revenue loaded, others are skeletons |
| ~1.2s | `public/proof/t2.png` | revenue and customers loaded |
| ~2.2s | `public/proof/t3.png` | all three loaded |

## Waterfall vs `Promise.all` (`/compare`)
| Approach | Time | Server log |
|---|---|---|
| Sequential awaits | ~3000 ms | customers starts at +302ms, activity at +1203ms, ends at +3005ms |
| `Promise.all` | ~1800 ms | all three start at +0ms, end at about +1801ms |

Sequential awaiting creates a staircase: each fetch starts only after the previous one finishes.
`Promise.all` removes the waterfall, but one component still waits for the slowest fetch, so the user
sees nothing from it for 1800 ms. Separate Suspense boundaries remove both problems. Use `Promise.all`
when one component needs all the data together, for example a total computed from several sources.
Screenshot: `public/proof/compare.png`.

## Plain Suspense vs parallel routes (`/slots`)
Both versions give the same timings (see the chunk output above).

| | Plain Suspense (`/`) | Parallel routes (`/slots`) |
|---|---|---|
| Layout and boundaries | One file | Layout plus one folder per slot |
| Loading UI | Explicit `<Suspense>` | `loading.tsx` per slot |
| Per-slot error and URL state | Manual | Built in (`error.tsx`, `default.tsx`) |
| Conditional slots (e.g. by role) | Manual | Natural fit |
| Cost | Low | More files, `default.tsx` handling |

Plain Suspense fits a fixed dashboard on one page. Parallel routes fit dashboards where slots navigate
independently, show different content per URL, or are shown conditionally. `/slots` has no per-widget
refresh button, since that would need a client wrapper like `Panel`.

## Bonus features
- **Per-widget refresh:** the `refreshWidget` Server Action re-renders one widget on the server and
  returns it as JSX. `Panel` stores it and bumps a `key`, which remounts only that widget's Suspense.
  The other two panels are untouched.
- **Failure containment:** `FAIL_WIDGET=customers` makes one widget throw. A `react-error-boundary`
  inside `Panel` contains it, the card keeps the same frame and height, and the other two keep
  streaming. Refresh resets the boundary, so it works as retry. Screenshot: `public/proof/failure.png`.
  The message is a minified React error because production builds redact server error messages.
- **3s "still loading" banner:** CSS-only. Skeleton bars carry `data-pending`, and
  `body:has([data-pending]) .late-banner` runs a 0s animation delayed by 3s. The banner appears only
  if a skeleton is still on screen after 3s, so fast loads never flash it. Tested by temporarily
  setting `getActivity` to 5000 ms. Screenshot: `public/proof/banner.png`.
- **Parallel routes alternative:** `/slots`, compared above.

## Server vs Client components
| Component | Type | Why |
|---|---|---|
| `page.tsx`, `compare/page.tsx`, `slots/*` | Server | no interactivity |
| `RevenueWidget`, `CustomersWidget`, `ActivityWidget`, `Card`, `Skeletons` | Server | async data and pure rendering |
| `Panel` | Client (leaf) | state, transition, error boundary; widgets are passed in as `children` so they stay on the server |
| `actions.tsx` | Server Action | re-renders one widget on demand |