"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePermission } from "@/hooks/usePermissions";

export default function Sidebar() {
  const { can } = usePermission();
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard", key: "dashboard" },
    { name: "Services", path: "/dashboard/services", key: "services" },
    { name: "Settings", path: "/dashboard/settings", key: "settings" },
    { name: "Order History", path: "/dashboard/order-history", key: "orders" },
  ];

  return (
    <aside className="w-60 bg-white border-r shadow-md p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Menu</h2>

      <ul className="flex-1 space-y-2">
        {menu
          .filter((m) => can(m.key))
          .map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.key}>
                <Link
                  href={item.path}
                  className={`block px-4 py-2 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-black text-white font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
      </ul>

      <div className="mt-auto text-gray-400 text-sm px-2">
        {can("users") && <p>Admin Access</p>}
      </div>
    </aside>
  );
}
