"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalItems: 0,
    todaySales: 0,
  });

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const totalSales = orders.reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;

    const totalItems = orders.reduce(
      (sum, o) => sum + o.items.reduce((i, it) => i + it.qty, 0),
      0
    );

    const today = new Date().toISOString().split("T")[0];

    const todaySales = orders
      .filter((o) => o.date.startsWith(today))
      .reduce((s, o) => s + o.total, 0);

    setStats({ totalSales, totalOrders, totalItems, todaySales });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value={`Rs ${stats.totalSales}`} />
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Items Sold" value={stats.totalItems} />
        <StatCard title="Today's Sales" value={`Rs ${stats.todaySales}`} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      <span className="text-gray-500 text-sm">{title}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
