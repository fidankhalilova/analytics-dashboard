// Async Server Component: 300ms revenue bar chart, bars sized as a % of the weekly max.
import { getRevenue } from "@/lib/data";
import { stamp } from "@/lib/timing";
import { Card } from "./Card";

export async function RevenueWidget() {
  const res = await getRevenue();
  const max = Math.max(...res.data.map((d) => d.amount));

  return (
    <Card title="Revenue (k$)" footer={stamp(res)}>
      <div className="flex h-full items-end gap-3">
        {res.data.map((d) => (
          <div
            key={d.day}
            className="flex h-full flex-1 flex-col justify-end text-center text-xs"
          >
            <div
              className="rounded bg-blue-500"
              style={{ height: `${(d.amount / max) * 85}%` }}
              title={`${d.amount}k`}
            />
            <span className="mt-1 text-gray-500">{d.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
