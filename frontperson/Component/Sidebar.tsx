"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (route: string) => pathname.startsWith(route);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const r = Cookies.get("role");
    if (r) setRole(r);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebarLogo">PeopleSystem</div>

      <nav className="sidebarNav">
        <Link
          href="/person/list"
          className={`sidebarLink ${isActive("/person/list") ? "sidebarLinkActive" : ""}`}
        >
          Lista principal
        </Link>

        <Link
          href="/person/external-list"
          className={`sidebarLink ${isActive("/person/external-list") ? "sidebarLinkActive" : ""}`}
        >
          Lista externa
        </Link>

        {/* 👉 Mostrar solo si role !== 2 */}
        {role === "Admin" && (
          <Link
            href="/person/create-user"
            className={`sidebarLink ${isActive("/person/create-user") ? "sidebarLinkActive" : ""}`}
          >
            Crear usuario
          </Link>
        )}
      </nav>
    </aside>
  );
}
