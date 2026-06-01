"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Calendar, CreditCard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function UserSidebar() {
  const pathname = usePathname();
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

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed right-4 bottom-4 z-40 p-2 bg-[#0074cc] text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Static Sidebar */}
      <aside className="hidden md:block absolute left-8 top-32 z-30 w-72 h-[calc(90vh-8rem)]">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-2 h-full">
          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-semibold ${
                    isActive
                      ? "bg-[#0074cc] text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 border border-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="fixed top-20 right-0 w-full bg-white shadow-lg md:hidden z-30">
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#0074cc] text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 md:hidden z-20 top-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
