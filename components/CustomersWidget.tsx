// Async Server Component: 900ms top-customers table.
import { getCustomers } from "@/lib/data";
import { stamp } from "@/lib/timing";
import { Card } from "./Card";

export async function CustomersWidget() {
  const res = await getCustomers();

  return (
    <Card title="Top customers" footer={stamp(res)}>
      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr>
            <th>Name</th>
            <th>Orders</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {res.data.map((c) => (
            <tr key={c.name} className="h-10 border-t">
              <td>{c.name}</td>
              <td>{c.orders}</td>
              <td className="text-right">${c.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
