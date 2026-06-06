"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "@/utils/cookie";
import { DOCTOR_TOKEN_KEY } from "@/constants/keys";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Settings,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { Doctor } from "@/@types/doctor";

const SidebarDoctor: React.FC<{ doctorData: Doctor }> = ({ doctorData }) => {
  const pathname = usePathname();
  const { push } = useRouter();

  if (!pathname.startsWith("/doctor")) {
    return null;
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/doctor",
      icon: LayoutDashboard,
    },
    {
      label: "Appointments",
      href: "/doctor/appointments",
      icon: CalendarDays,
    },
    {
      label: "Patients",
      href: "/doctor/myPatients",
      icon: Users,
    },
    {
      label: "Reports",
      href: "/doctor/reportsDoctor",
      icon: FileText,
    },
    {
      label: "Settings",
      href: "/doctor/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="font-bold text-xl text-slate-900">MediSync</h1>
            <p className="text-xs text-slate-500">Doctor Portal</p>
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
              (item.href !== "/doctor" && pathname.startsWith(item.href));

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

      {/* Doctor Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
              {doctorData.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 truncate">
                {doctorData.name}
              </p>

              <p className="text-xs text-slate-500">
                {(doctorData?.specialization || "")
                  .toString()
                  .replaceAll("_", " ")}
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              await deleteCookie(DOCTOR_TOKEN_KEY);
              push("/doctor/login");
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarDoctor;
