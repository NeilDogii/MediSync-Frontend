"use client";

import React from "react";
import {
  Calendar,
  FileText,
  Users,
  Activity,
  Clock,
  ChevronRight,
} from "lucide-react";
import { DoctorDashboardData } from "@/utils/requests/misc/doctor";

import PatientList from "./patientList";

export default function DoctorDashboard({
  children,
  dashboardData,
}: {
  children?: React.ReactNode;
  dashboardData: DoctorDashboardData | null;
}) {
  return (
    <div className="ml-64 min-h-screen bg-[#F8FAFC] overflow-y-auto">
      <div className="p-8 lg:p-10">
        {children}

        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F4C81] via-[#0B6CB8] to-[#38BDF8] p-8 shadow-xl">
            <div className="relative z-10">
              <p className="text-blue-100 text-sm mb-2">Welcome Back</p>

              <h1 className="text-4xl font-bold text-white">
                Clinical Dashboard
              </h1>

              <p className="text-blue-100 mt-2 max-w-2xl">
                Manage appointments, reports and patient care efficiently from
                one centralized dashboard.
              </p>
            </div>

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users size={24} />}
            title="Total Patients"
            value={dashboardData?.patientCount || 0}
          />

          <StatCard
            icon={<Activity size={24} />}
            title="Total Visits"
            value={dashboardData?.totalVisitCount || 0}
          />

          <StatCard
            icon={<FileText size={24} />}
            title="Pending Reports"
            value={dashboardData?.pendingReportsCount || 0}
          />

          <StatCard
            icon={<Calendar size={24} />}
            title="Appointments Today"
            value={dashboardData?.appointmentsTodayCount || 0}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="xl:col-span-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Upcoming Appointments
              </h2>

              <button className="flex items-center gap-1 text-[#0B6CB8] font-medium">
                View All
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {dashboardData?.upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                      {appointment.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {appointment.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span>{new Date(appointment.date).toDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Reports */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Pending Reports
            </h2>

            <div className="space-y-4">
              {/* Currently no pending reports in dashboard data, keeping placeholder for now */}
              {dashboardData?.pendingReports.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">Patient - {item.name}</h3>

                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    Awaiting review and submission.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="mt-6 bg-white/95 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Patients</h2>

            <button className="text-[#0B6CB8] font-medium">View All</button>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            <PatientList
              items={
                dashboardData?.recentPatients.map((patient) => ({
                  id: patient.id,
                  initials: patient.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")
                    .toUpperCase(),
                  name: patient.name,
                  purpose: "Recent Visit",
                  time: new Date(patient.date).toLocaleDateString(),
                  color: "blue",
                })) || []
              }
            />
          </div>
        </div>
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
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-sm transition-all duration-300">
      {/* Accent */}
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#0B6CB8] to-[#38BDF8]" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-2 text-4xl font-bold text-slate-900 leading-none">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] text-white shadow-md">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium text-slate-500">
          Updated today
        </span>
      </div>
    </div>
  );
}
