// Customers slot fallback.
import { Card } from "@/components/Card";
import { CustomersSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <Card title="Top customers">
      <CustomersSkeleton />
    </Card>
  );
}
