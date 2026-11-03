"use client"; // Client leaf: holds the remount key and refresh transition, and hosts the error boundary.
import { Suspense, useState, useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { refreshWidget } from "@/app/actions";
import type { WidgetName } from "@/lib/types";
import { Card } from "./Card";

type Props = {
  name: WidgetName;
  title: string;
  fallback: React.ReactNode;
  children: React.ReactNode;
};

export function Panel({ name, title, fallback, children }: Props) {
  const [view, setView] = useState({ key: 0, content: children });
  const [pending, start] = useTransition();

  const refresh = () =>
    start(async () => {
      const content = await refreshWidget(name);
      setView((v) => ({ key: v.key + 1, content }));
    });

  return (
    <div className="relative">
      <button
        onClick={refresh}
        disabled={pending}
        className="absolute right-4 top-3 z-10 text-xs text-blue-600 disabled:opacity-50"
      >
        {pending ? "Refreshing…" : "Refresh"}
      </button>
      <ErrorBoundary
        key={view.key}
        fallbackRender={({ error }) => (
          <Card title={title} footer="failed">
            <p role="alert" className="text-sm text-red-600">
              {error instanceof Error ? error.message : String(error)}
            </p>
          </Card>
        )}
      >
        <Suspense
          key={view.key}
          fallback={<Card title={title}>{fallback}</Card>}
        >
          {view.content}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
