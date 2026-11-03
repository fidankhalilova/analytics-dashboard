// Same three fetches awaited sequentially vs with Promise.all, each timed in its own Suspense boundary.
import { Suspense } from "react";
import { getActivity, getCustomers, getRevenue } from "@/lib/data";

const sources = [getRevenue, getCustomers, getActivity];

async function Sequential() {
  const t = performance.now();
  for (const get of sources) await get(); // each fetch starts only after the previous one finishes
  return (
    <Result label="Sequential awaits (waterfall)" ms={performance.now() - t} />
  );
}

async function Parallel() {
  const t = performance.now();
  await Promise.all(sources.map((get) => get())); // all three start in the same tick
  return <Result label="Promise.all (parallel)" ms={performance.now() - t} />;
}

const Result = ({ label, ms }: { label: string; ms: number }) => (
  <div className="rounded-lg border bg-white p-6">
    <h2 className="font-semibold">{label}</h2>
    <p className="mt-2 text-4xl font-bold">{Math.round(ms)} ms</p>
  </div>
);

const Pending = () => (
  <div className="h-29 animate-pulse rounded-lg bg-gray-200" />
);

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Waterfall vs parallel</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<Pending />}>
          <Sequential />
        </Suspense>
        <Suspense fallback={<Pending />}>
          <Parallel />
        </Suspense>
      </div>
    </div>
  );
}
