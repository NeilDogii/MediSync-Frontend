"use client";

import { GOOGLE_CLIENT_ID } from "@/constants/environment/variables";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import GoogleLoginBtn from "../GoogleLoginBtn";
import { PatientLogin } from "@/utils/requests/auth/patient";
import { setCookie } from "@/utils/cookie";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";

export default function UserLoginForm({
  togglePopupType,
}: {
  togglePopupType?: (type: "LOGIN" | "REGISTER") => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <Image
          src="/assets/logo.jpg"
          alt="Logo"
          width={150}
          height={80}
          className="h-10 mx-auto mb-2"
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Login to Continue
        </h1>
        <p className="text-sm text-gray-500">Sign in with email or phone</p>
      </div>
      {/* Form */}
      <form
        action={async (formData) => {
          const res = await PatientLogin({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          });

          if (!res.success) {
            alert(res.message);
          } else if (res.token) {
            alert("Login successful!: ");
            await setCookie(PATIENT_TOKEN_KEY, res.token);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }}
        className="space-y-4"
      >
        {/* Email / Phone */}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
            Email / Phone
          </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="example@email.com or 9876543210"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-600 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10
                               focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-2 mt-2 bg-indigo-700 text-white rounded-lg
                           font-medium hover:bg-indigo-600 transition cursor-pointer"
        >
          Login
        </button>
      </form>
      {/* Divider */}
      <div className="flex items-center my-5">
        <div className="flex-grow h-px bg-gray-200" />
        <span className="px-3 text-xs text-gray-400">OR</span>
        <div className="flex-grow h-px bg-gray-200" />
      </div>
      {/* Google Login */}
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLoginBtn />
      </GoogleOAuthProvider>
      {/* Footer */}
      <p className="text-xs text-center text-gray-400 mt-5">
        {togglePopupType && (
          <>
            <span>Don&apos;t have an account? </span>
            <span
              className="text-[#0074cc] font-semibold hover:underline cursor-pointer mr-2"
              onClick={() => togglePopupType("LOGIN")}
            >
              {"Register"}
            </span>
          </>
        )}
        © 2025 Patient Login
      </p>
    </div>
  );
}
