// Activity slot fallback.
import { Card } from "@/components/Card";
import { ActivitySkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <Card title="Recent activity">
      <ActivitySkeleton />
    </Card>
  );
}
