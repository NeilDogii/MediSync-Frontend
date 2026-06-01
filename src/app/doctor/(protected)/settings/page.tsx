"use client";

import React, { useState } from "react";
import SidebarDoctor from "@/components/DoctorComponents/SidebarDoctor";
import { Mail, Phone, User, Lock } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "Dr. Kim Lee",
    email: "dr.kim@medisync.com",
    phone: "9876543210",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      appointments: true,
      reports: true,
      reminders: false,
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <SidebarDoctor />

      <div className="ml-64 min-h-screen p-8 bg-[#D2F0F6]">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mb-8">
          Manage your profile, account and notification preferences.
        </p>

        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl">
          {/* PROFILE INFORMATION  */}

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Profile Information
          </h2>

          <div className="grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <div className="flex items-center gap-2 mt-1 border rounded-lg p-2">
                <User size={18} className="text-gray-500" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="flex-1 outline-none"
                  type="text"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <div className="flex items-center gap-2 mt-1 border rounded-lg p-2">
                <Mail size={18} className="text-gray-500" />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 outline-none"
                  type="email"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-gray-600">Phone Number</label>
              <div className="flex items-center gap-2 mt-1 border rounded-lg p-2">
                <Phone size={18} className="text-gray-500" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="flex-1 outline-none"
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-b my-8"></div>

          {/* CHANGE PASSWORD AREA */}

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Change Password
          </h2>

          <div className="grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">
            {/* Current Password */}
            <div>
              <label className="text-sm text-gray-600">Current Password</label>
              <div className="flex items-center gap-2 mt-1 border rounded-lg p-2">
                <Lock size={18} className="text-gray-500" />
                <input
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="flex-1 outline-none"
                  type="password"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm text-gray-600">New Password</label>
              <div className="flex items-center gap-2 mt-1 border rounded-lg p-2">
                <Lock size={18} className="text-gray-500" />
                <input
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="flex-1 outline-none"
                  type="password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-gray-600">Confirm Password</label>
              <div className="flex items-center gap-2 mt-1 border rounded-lg p-2">
                <Lock size={18} className="text-gray-500" />
                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="flex-1 outline-none"
                  type="password"
                />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="border-b my-8"></div>

          {/* ===================== */}
          {/* NOTIFICATIONS AREA */}
          {/* ===================== */}
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Notification Preferences
          </h2>

          <div className="space-y-4">
            {/* Appointments */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifications.appointments}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notifications: {
                      ...form.notifications,
                      appointments: e.target.checked,
                    },
                  })
                }
              />
              <span className="text-gray-700">Upcoming Appointment Alerts</span>
            </label>

            {/* Reports */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifications.reports}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notifications: {
                      ...form.notifications,
                      reports: e.target.checked,
                    },
                  })
                }
              />
              <span className="text-gray-700">Report Ready Notifications</span>
            </label>

            {/* Reminders */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifications.reminders}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notifications: {
                      ...form.notifications,
                      reminders: e.target.checked,
                    },
                  })
                }
              />
              <span className="text-gray-700">Daily Summary Reminders</span>
            </label>
          </div>

          {/* Save Button */}
          <button className="mt-10 px-6 py-3 bg-[#0077B6] text-white rounded-lg hover:bg-[#005f8c] transition shadow-md">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
