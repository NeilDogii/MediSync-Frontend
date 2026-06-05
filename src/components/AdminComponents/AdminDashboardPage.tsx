/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Stethoscope,
  FileText,
  ArrowRight,
  ClipboardEdit,
} from "lucide-react";
import { Doctor, DoctorReport } from "@/@types/doctor";
import { Patient } from "@/@types/patient";

export default function AdminDashboardPage({
  doctors,
  patients,
  reports,
}: {
  doctors: Doctor[];
  patients: Patient[];
  reports: DoctorReport[];
}) {
  return (
    <div className="ml-64 min-h-screen bg-slate-50 p-8">
      {/* HERO */}

      <div className="mb-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F4C81] via-[#0B6CB8] to-[#38BDF8] p-8 shadow-xl">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-2">Admin Portal</p>

            <h1 className="text-4xl font-bold text-white">Dashboard</h1>

            <p className="text-blue-100 mt-2">
              Manage doctors, patients and monitor platform activity.
            </p>
          </div>

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10" />
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Doctors"
          value={doctors.length}
          icon={<Stethoscope size={22} />}
        />

        <StatCard
          title="Patients"
          value={patients.length}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Reports"
          value={reports.length}
          icon={<ClipboardEdit size={22} />}
        />
      </div>

      {/* QUICK ACTIONS */}

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ActionCard
            href="/admin/doctors"
            title="Manage Doctors"
            icon={<Stethoscope size={22} />}
          />

          <ActionCard
            href="/admin/patients"
            title="Manage Patients"
            icon={<Users size={22} />}
          />

          <ActionCard
            href="/admin/reports"
            title="View Reports"
            icon={<FileText size={22} />}
          />
        </div>
      </div>

      {/* RECENT */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DataCard
          title="Recent Doctors"
          rows={doctors.map((d) => ({
            title: d.name,
            subtitle: d.specialization,
            status: d.isActive ? "Active" : "Blocked",
          }))}
        />

        <DataCard
          title="Recent Patients"
          rows={patients.map((p) => ({
            title: p.name,
            subtitle: `${p.age} years`,
            status: p.isActive ? "Active" : "Blocked",
          }))}
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      {/* Accent */}

      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#0B6CB8] to-[#38BDF8]" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-4xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] text-white shadow-md">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />

        <span className="text-xs text-slate-500">Updated today</span>
      </div>
    </div>
  );
}

function ActionCard({ href, title, icon }: any) {
  return (
    <Link href={href}>
      <div className="group rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] text-white shadow-sm">
              {icon}
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">{title}</h3>

              <p className="text-xs text-slate-500">Open section</p>
            </div>
          </div>

          <ArrowRight
            size={18}
            className="
              text-slate-400
              transition
              group-hover:text-[#0B6CB8]
              group-hover:translate-x-1
            "
          />
        </div>
      </div>
    </Link>
  );
}

function DataCard({ title, rows }: any) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-5">{title}</h2>

      <div className="space-y-4">
        {rows.map((r: any, i: number) => (
          <div key={i} className="flex justify-between border rounded-2xl p-4">
            <div>
              <p className="font-semibold">{r.title}</p>

              <p className="text-sm text-slate-500">{r.subtitle}</p>
            </div>

            <span
              className={`text-sm font-semibold ${
                r.status === "Active" ? "text-green-600" : "text-red-500"
              }`}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
