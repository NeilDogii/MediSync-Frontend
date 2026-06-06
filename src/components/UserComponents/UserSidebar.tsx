"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Calendar, CreditCard, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { deleteCookie } from "@/utils/cookie";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";

export default function UserSidebar() {
  const pathname = usePathname();
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      href: "/user/dashboard",
      label: "Profile",
      icon: User,
    },
    {
      href: "/user/appointments",
      label: "Appointments",
      icon: Calendar,
    },
    {
      href: "/user/payments",
      label: "Payments",
      icon: CreditCard,
    },
  ];

  const handleLogout = async () => {
    await deleteCookie(PATIENT_TOKEN_KEY);
    push("/");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-5 right-5 z-50 p-3 rounded-2xl
        bg-gradient-to-r from-[#0074cc] to-blue-600
        text-white shadow-xl"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-50 md:z-30 h-screen md:h-auto w-[300px] transform transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="h-full bg-white/80 backdrop-blur-xl border-r md:border border-white/50 shadow-2xl rounded-none md:rounded-3xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-7 border-b bg-gradient-to-br from-[#0074cc] to-blue-500 text-white">
            <div className="flex items-center gap-4">
              <div
                className="
                h-14 w-14 rounded-full
                bg-white/20
                flex items-center justify-center
              "
              >
                <User size={26} />
              </div>

              <div>
                <h2 className="font-bold text-lg">My Account</h2>
                <p className="text-sm text-blue-100">Manage your profile</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-5 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 relative
                    ${
                      isActive
                        ? `bg-gradient-to-r from-[#0074cc] to-blue-500 text-white shadow-lg scale-[1.02]`
                        : `text-gray-700 hover:bg-blue-50 hover:translate-x-1`
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-white" />
                  )}

                  <Icon size={20} />

                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-5 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 transition-all font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
