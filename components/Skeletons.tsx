// Server Components: each skeleton mirrors its widget's real layout (same rows, heights and widths).
const Bar = ({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    data-pending
    style={style}
    className={`animate-pulse rounded bg-gray-200 ${className}`}
  />
);

export const RevenueSkeleton = () => (
  <div className="flex h-full items-end gap-3">
    {[40, 65, 35, 80, 60, 95, 50].map((h, i) => (
      <Bar key={i} className="flex-1" style={{ height: `${h}%` }} />
    ))}
  </div>
);

export const CustomersSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }, (_, i) => (
      <Bar key={i} className="h-10" />
    ))}
  </div>
);

export const ActivitySkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 6 }, (_, i) => (
      <Bar key={i} className="h-8" />
    ))}
  </div>
);
