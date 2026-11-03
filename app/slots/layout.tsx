// Parallel-routes layout: Next passes each @slot folder in as a prop, rendered independently.
type Slots = Record<
  "children" | "revenue" | "customers" | "activity",
  React.ReactNode
>;

export default function SlotsLayout({
  children,
  revenue,
  customers,
  activity,
}: Slots) {
  return (
    <div className="space-y-6">
      {children}
      <div className="grid gap-6 lg:grid-cols-3">
        {revenue}
        {customers}
        {activity}
      </div>
    </div>
  );
}
