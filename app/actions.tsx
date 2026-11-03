"use server"; // Server Action: re-renders ONE widget on the server and returns it as JSX.
import { ActivityWidget } from "@/components/ActivityWidget";
import { CustomersWidget } from "@/components/CustomersWidget";
import { RevenueWidget } from "@/components/RevenueWidget";
import type { WidgetName } from "@/lib/types";

const widgets = {
  revenue: RevenueWidget,
  customers: CustomersWidget,
  activity: ActivityWidget,
};

export async function refreshWidget(name: WidgetName) {
  if (!(name in widgets)) throw new Error("Unknown widget"); // validate input on the server
  const Widget = widgets[name];
  return <Widget />;
}
