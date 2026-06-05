"use client";

import React, { useState } from "react";
import { IndianRupeeIcon, Mail, Phone, User } from "lucide-react";
import { DoctorSpecialization } from "@/@types/enum";
import { Doctor } from "@/@types/doctor";
import { updateDoctorSettings } from "@/utils/requests/misc/doctor";

export default function DoctorSettings({
  doctorId,
  data,
}: {
  doctorId: number;
  data: Doctor | null;
}) {
  const [form, setForm] = useState({
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    specialization: data?.specialization || DoctorSpecialization.CARDIOLOGY,
    fees: data?.fees || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="ml-64 min-h-screen bg-slate-50 p-8">
      {/* Hero */}

      <div className="mb-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F4C81] via-[#0B6CB8] to-[#38BDF8] p-8 shadow-xl">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-2">Doctor Portal</p>

            <h1 className="text-4xl font-bold text-white">Settings</h1>

            <p className="text-blue-100 mt-2">
              Manage account preferences, notifications and security.
            </p>
          </div>

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Profile Section */}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] flex items-center justify-center text-white">
            <User size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Profile Information
            </h2>

            <p className="text-slate-500 text-sm">
              Update your personal details.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            icon={<User size={18} />}
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <InputField
            label="Email Address"
            icon={<Mail size={18} />}
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            label="Phone Number"
            icon={<Phone size={18} />}
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <InputField
            label="Fees"
            icon={<IndianRupeeIcon size={18} />}
            name="fees"
            value={form.fees}
            onChange={handleChange}
          />
          <DropdownField
            label="Specialization"
            icon={<IndianRupeeIcon size={18} />}
            options={Object.values(DoctorSpecialization)
              .filter((spec) => spec.toString().length > 3)
              .map((spec) => ({
                value: spec.toString(),
                label: spec.toString(),
              }))}
            props={{
              name: "specialization",
              value: form.specialization,
              onChange: (e) =>
                setForm({
                  ...form,
                  specialization: e.target
                    .value as unknown as DoctorSpecialization,
                }),
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#0B6CB8] to-[#38BDF8] text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          onClick={async () => {
            await updateDoctorSettings(doctorId, form);
            alert("Settings updated successfully!");
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InputField({ label, icon, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-2 block">{label}</label>

      <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 h-12 focus-within:border-[#0B6CB8]">
        <div className="text-slate-400">{icon}</div>

        <input {...props} className="flex-1 outline-none bg-transparent" />
      </div>
    </div>
  );
}

function DropdownField({
  label,
  icon,
  options,
  ...props
}: {
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  props?: React.SelectHTMLAttributes<HTMLSelectElement>;
}) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-2 block">{label}</label>

      <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 h-12 focus-within:border-[#0B6CB8]">
        <div className="text-slate-400">{icon}</div>

        <select {...props} className="flex-1 outline-none bg-transparent">
          {options.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
