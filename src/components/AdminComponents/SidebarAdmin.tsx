"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "@/utils/cookie";
import { ADMIN_TOKEN_KEY } from "@/constants/keys";

import {
  LayoutDashboard,
  LogOut,
  ClipboardClockIcon,
  UserCog2,
  StethoscopeIcon,
  UsersIcon,
  SettingsIcon,
  MessageSquareText,
} from "lucide-react";

const SidebarAdmin: React.FC<{
  adminData: {
    id: number;
    username: string;
  };
}> = ({ adminData }) => {
  const pathname = usePathname();
  const { push } = useRouter();

  if (!pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Doctors",
      href: "/admin/doctors",
      icon: StethoscopeIcon,
    },
    {
      label: "Patients",
      href: "/admin/patients",
      icon: UsersIcon,
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: ClipboardClockIcon,
    },
    {
      label: "Contact Requests",
      href: "/admin/contacts",
      icon: MessageSquareText,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <UserCog2 className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="font-bold text-xl text-slate-900">MediSync</h1>
            <p className="text-xs text-slate-500">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-4">
          Navigation
        </p>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-2xl
                  transition-all duration-200
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-700"
                  }`}
                />

                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
              {adminData?.username.charAt(0).toUpperCase() || "A"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="capitalize font-semibold text-slate-900 truncate">
                {adminData?.username || "Admin"}
              </p>

              <p className="text-xs text-slate-500">
                {"Admin".toString().replaceAll("_", " ")}
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              await deleteCookie(ADMIN_TOKEN_KEY);
              push("/admin/login");
            }}
            className="
              mt-4 w-full
              flex items-center justify-center gap-2
              rounded-xl
              border border-red-100
              bg-red-50
              py-2.5
              text-sm font-medium
              text-red-600
              hover:bg-red-100
              transition
            "
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
