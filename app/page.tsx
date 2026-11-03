// Dashboard: static shell renders instantly; each widget streams in through its own Panel/Suspense.
import { ActivityWidget } from "@/components/ActivityWidget";
import { CustomersWidget } from "@/components/CustomersWidget";
import { Panel } from "@/components/Panel";
import { RevenueWidget } from "@/components/RevenueWidget";
import {
  ActivitySkeleton,
  CustomersSkeleton,
  RevenueSkeleton,
} from "@/components/Skeletons";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          name="revenue"
          title="Revenue (k$)"
          fallback={<RevenueSkeleton />}
        >
          <RevenueWidget />
        </Panel>
        <Panel
          name="customers"
          title="Top customers"
          fallback={<CustomersSkeleton />}
        >
          <CustomersWidget />
        </Panel>
        <Panel
          name="activity"
          title="Recent activity"
          fallback={<ActivitySkeleton />}
        >
          <ActivityWidget />
        </Panel>
      </div>
    </div>
  );
}
