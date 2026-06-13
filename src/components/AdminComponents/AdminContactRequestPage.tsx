"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  Eye,
  X,
  Trash2,
} from "lucide-react";
import { ContactRequest } from "@/@types/misc";

export default function AdminContactRequestPage({
  data,
}: {
  data: ContactRequest[];
}) {
  const [selected, setSelected] = useState<ContactRequest | null>(null);

  return (
    <div className="ml-64 min-h-screen bg-slate-50 p-8">
      {/* HERO */}
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#065F46] via-[#10B981] to-[#6EE7B7] p-8 shadow-xl">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-2">Admin Portal</p>

            <h1 className="text-4xl font-bold text-white">Contact Requests</h1>

            <p className="text-blue-100 mt-2">
              View and manage messages submitted by users.
            </p>
          </div>

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10" />
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#047857] to-[#34D399] flex items-center justify-center text-white">
            {" "}
            <MessageSquare size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold">Incoming Requests</h2>

            <p className="text-sm text-slate-500">
              Click a request to view complete details.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Name</th>

                <th className="text-left p-4">Email</th>

                <th className="text-left p-4">Phone</th>

                <th className="text-left p-4">Topic</th>

                <th className="text-left p-4">Date</th>

                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="
                      p-10
                      text-center
                      text-slate-500
                    "
                  >
                    No contact requests found.
                  </td>
                </tr>
              )}

              {data.map((item) => (
                <tr
                  key={item.id}
                  className="
                    border-t
                    hover:bg-slate-50
                  "
                >
                  <td className="p-4">{item.name || "-"}</td>

                  <td className="p-4">{item.email || "-"}</td>

                  <td className="p-4">{item.phone || "-"}</td>

                  <td className="p-4">{item.topic || "-"}</td>

                  <td className="p-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setSelected(item)}
                        className="
                          p-2
                          rounded-xl
                           bg-emerald-100
  text-emerald-700
  hover:bg-emerald-200
  transition

                        "
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="
                          p-2
                          rounded-xl
                          bg-red-100
                          text-red-500
                        "
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl w-[700px] p-8 relative">
            <button
              onClick={() => setSelected(null)}
              className="
                absolute
                right-6
                top-6
              "
            >
              <X />
            </button>

            <h2 className="text-3xl font-bold mb-8">Contact Request</h2>

            <div className="space-y-5">
              <Info
                icon={<User size={18} />}
                label="Name"
                value={selected.name}
              />

              <Info
                icon={<Mail size={18} />}
                label="Email"
                value={selected.email}
              />

              <Info
                icon={<Phone size={18} />}
                label="Phone"
                value={selected.phone}
              />

              <Info
                icon={<MessageSquare size={18} />}
                label="Topic"
                value={selected.topic}
              />

              <Info
                icon={<Calendar size={18} />}
                label="Submitted"
                value={new Date(selected.createdAt).toLocaleString()}
              />

              <div>
                <label className="text-sm text-slate-500">Message</label>

                <div
                  className="
                    mt-2
                    rounded-2xl
                    border
                    p-5
                    whitespace-pre-wrap
                    text-slate-700
                  "
                >
                  {selected.message || "No message provided"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;

  label: string;

  value?: string | null;
}) {
  return (
    <div>
      <label className="text-sm text-slate-500">{label}</label>

      <div
        className="
          mt-2
          flex
          items-center
          gap-3
          rounded-2xl
          border
          px-4
          h-12
        "
      >
        <div className="text-slate-400">{icon}</div>

        <span>{value || "-"}</span>
      </div>
    </div>
  );
}
