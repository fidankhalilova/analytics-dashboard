// Server Component: shared widget frame with a fixed-height body so skeleton and content never shift layout.
type Props = { title: string; footer?: string; children: React.ReactNode };

export function Card({ title, footer, children }: Props) {
  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="mb-3 font-semibold">{title}</h2>
      <div className="h-64 overflow-hidden">{children}</div>
      <p className="mt-3 h-4 text-xs text-gray-400">{footer}</p>
    </section>
  );
}
