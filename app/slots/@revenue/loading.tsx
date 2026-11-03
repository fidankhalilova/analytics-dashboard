// Revenue slot fallback: Next wraps this slot in its own Suspense automatically.
import { Card } from "@/components/Card";
import { RevenueSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <Card title="Revenue (k$)">
      <RevenueSkeleton />
    </Card>
  );
}
