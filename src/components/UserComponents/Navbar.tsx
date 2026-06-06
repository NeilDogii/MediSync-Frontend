"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  FileText,
  CreditCard,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Popup from "../global/Popup";
import UserLoginForm from "./forms/UserLoginForm";
import UserRegisterForm from "./forms/UserRegisterForm";
import { deleteCookie } from "@/utils/cookie";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";

export default function Navbar({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState<"LOGIN" | "REGISTER" | null>(null);
  const pathname = usePathname();

  function togglePopupType(type: "LOGIN" | "REGISTER") {
    if (type == "LOGIN") {
      setShowPopup("REGISTER");
    } else if (type == "REGISTER") {
      setShowPopup("LOGIN");
    } else {
      setShowPopup(null);
    }
  }

  const getLinkClass = (href: string) =>
    pathname === href
      ? "text-[#0074cc] font-bold"
      : "text-black hover:text-[#0074cc]";

  return (
    <nav className="fixed top-7 left-8 right-8 z-50 bg-white shadow-md rounded-2xl mx-auto my-4 px-4 md:px-8 py-3 max-w-[95%] lg:max-w-[90%]">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/assets/logo.jpg"
            alt="MediSync Logo"
            width={130}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <Link href="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link href="/appointment" className={getLinkClass("/appointment")}>
            Book Now
          </Link>

          <Link href="/contact" className={getLinkClass("/contact")}>
            Contact Us
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative group">
              <div className="flex items-center space-x-4 cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#0074cc] rounded-full flex items-center justify-center text-white font-semibold hover:bg-[#005fa3] transition-colors">
                    U
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-2">
                  <Link
                    href="/user/dashboard"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0074cc] transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/user/appointments"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0074cc] transition-colors"
                  >
                    <Calendar size={18} />
                    <span>My Appointments</span>
                  </Link>
                  <Link
                    href="/user/payments"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#0074cc] transition-colors"
                  >
                    <CreditCard size={18} />
                    <span>Payments</span>
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={async () => {
                      await deleteCookie(PATIENT_TOKEN_KEY);
                      window.location.reload();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                // href="/signup"
                className="text-[#0074cc] font-semibold hover:underline cursor-pointer"
                onClick={() => setShowPopup("REGISTER")}
              >
                Sign Up
              </div>
              <div
                // href="/login"
                className="bg-[#0074cc] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#005fa3] cursor-pointer"
                onClick={() => setShowPopup("LOGIN")}
              >
                Log In
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#0074cc] focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-end items-center px-6 py-4 border-b">
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#0074cc] focus:outline-none"
          >
            <X size={26} />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col px-6 py-6 space-y-6 text-lg font-medium">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={getLinkClass("/")}
          >
            Home
          </Link>
          <Link
            href="/appointment"
            onClick={() => setIsOpen(false)}
            className={getLinkClass("/book")}
          >
            Book Now
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className={getLinkClass("/contact")}
          >
            Contact Us
          </Link>

          {/* Mobile Buttons */}
          <div className="border-t pt-5 flex flex-col space-y-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/user/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-[#0074cc] cursor-pointer rounded-lg font-semibold transition-all hover:bg-blue-50 px-3 py-2"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/user/appointments"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-[#0074cc] cursor-pointer rounded-lg font-semibold transition-all hover:bg-blue-50 px-3 py-2"
                >
                  <Calendar size={18} />
                  <span>My Appointments</span>
                </Link>
                <Link
                  href="/user/payments"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-[#0074cc] cursor-pointer rounded-lg font-semibold transition-all hover:bg-blue-50 px-3 py-2"
                >
                  <CreditCard size={18} />
                  <span>Payments</span>
                </Link>
                <Link
                  href="/user/medical-records"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-[#0074cc] cursor-pointer rounded-lg font-semibold transition-all hover:bg-blue-50 px-3 py-2"
                >
                  <FileText size={18} />
                  <span>Medical Records</span>
                </Link>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={async () => {
                    await deleteCookie(PATIENT_TOKEN_KEY);
                    window.location.reload();
                  }}
                  className="flex items-center space-x-2 text-red-500 cursor-pointer rounded-lg font-semibold transition-all hover:bg-red-50 px-3 py-2"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <div
                  // href="/signup"
                  onClick={() => {
                    setIsOpen(false);
                    setShowPopup("REGISTER");
                  }}
                  className="border border-[#0074cc] text-[#0074cc] text-center px-6 py-2 rounded-lg font-semibold hover:bg-[#0074cc] hover:text-white transition-all"
                >
                  Sign Up
                </div>
                <div
                  // href="/login"
                  onClick={() => {
                    setIsOpen(false);
                    setShowPopup("LOGIN");
                  }}
                  className="bg-[#0074cc] text-white text-center px-6 py-2 rounded-lg font-semibold hover:bg-[#005fa3] transition-all"
                >
                  Log In
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Popup
        showPopup={showPopup != null}
        onChangeShowPopup={(set) => {
          if (!set) setShowPopup(null);
        }}
      >
        {showPopup === "LOGIN" && (
          <UserLoginForm togglePopupType={togglePopupType} />
        )}
        {showPopup === "REGISTER" && (
          <UserRegisterForm togglePopupType={togglePopupType} />
        )}
      </Popup>
    </nav>
  );
}
