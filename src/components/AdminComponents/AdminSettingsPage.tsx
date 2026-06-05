"use client";

import React, { useState } from "react";
import { User, Lock, ShieldCheck } from "lucide-react";
import { updateAdmin } from "@/utils/requests/data/admin";

// Example request
// import { updateAdminSettings } from "@/utils/requests/misc/admin";

export default function AdminSettingsPage({
  adminId,
  data,
}: {
  adminId: number;
  data: {
    username: string;
  } | null;
}) {
  const [form, setForm] = useState({
    username: data?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await updateAdmin({
      id: adminId,
      data: {
        username: form.username,
        password: form.currentPassword,
      },
    });

    alert("Settings updated successfully");

    setForm((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className="ml-64 min-h-screen bg-slate-50 p-8">
      {/* HERO */}
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F4C81] via-[#0B6CB8] to-[#38BDF8] p-8 shadow-xl">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-2">Admin Portal</p>

            <h1 className="text-4xl font-bold text-white">Settings</h1>

            <p className="text-blue-100 mt-2">
              Update your login credentials and account security.
            </p>
          </div>

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10" />
        </div>
      </div>

      {/* SETTINGS CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold">Account Settings</h2>

            <p className="text-sm text-slate-500">
              Change username and password.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Username"
            name="username"
            value={form.username}
            icon={<User size={18} />}
            onChange={handleChange}
          />
          <span></span>
          <InputField
            label="New Password"
            name="newPassword"
            type="password"
            value={form.newPassword}
            icon={<Lock size={18} />}
            onChange={handleChange}
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            icon={<Lock size={18} />}
            onChange={handleChange}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="
              px-8
              py-3
              rounded-2xl
              text-white
              font-semibold
              shadow-lg
              bg-gradient-to-r
              from-[#0B6CB8]
              to-[#38BDF8]
              hover:shadow-xl
              transition
            "
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  icon,
  ...props
}: {
  label: string;
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-2 block">{label}</label>

      <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 h-12 focus-within:border-[#0B6CB8]">
        <div className="text-slate-400">{icon}</div>

        <input {...props} className="flex-1 bg-transparent outline-none" />
      </div>
    </div>
  );
}
