// Async Server Component: 1800ms recent-activity feed.
import { getActivity } from "@/lib/data";
import { stamp } from "@/lib/timing";
import { Card } from "./Card";

export async function ActivityWidget() {
  const res = await getActivity();

  return (
    <Card title="Recent activity" footer={stamp(res)}>
      <ul className="space-y-3 text-sm">
        {res.data.map((a) => (
          <li
            key={a.id}
            className="flex h-8 items-center justify-between border-b"
          >
            <span>{a.text}</span>
            <span className="text-gray-400">{a.time}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
