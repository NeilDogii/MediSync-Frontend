import { DataTable } from "@/components/AdminComponents/data-table";
import { patientColumns } from "@/components/AdminComponents/patientColumns";

import { fetchPatients } from "@/utils/requests/data/admin";

import { Users, ShieldCheck, ShieldX } from "lucide-react";

export default async function PatientListPage() {
  const patientData = await fetchPatients();

  const totalPatients = patientData.length;

  const activePatients = patientData.filter((p) => p.isActive).length;

  const inActivePatients = patientData.filter((p) => !p.isActive).length;

  return (
    <div className="ml-64 min-h-screen bg-slate-50 p-8">
      {/* HERO */}

      <div className="mb-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F4C81] via-[#0B6CB8] to-[#38BDF8] p-8 shadow-xl">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-2">Admin Portal</p>

            <h1 className="text-4xl font-bold text-white">
              Patient Management
            </h1>

            <p className="text-blue-100 mt-2">
              View, monitor and manage patient accounts across the platform.
            </p>
          </div>

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10" />
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Active Patients"
          value={activePatients}
          icon={<ShieldCheck size={22} />}
        />

        <StatCard
          title="Blocked Patients"
          value={inActivePatients}
          icon={<ShieldX size={22} />}
        />
      </div>

      {/* TABLE */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] flex items-center justify-center text-white">
            <Users />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Registered Patients</h2>

            <p className="text-sm text-slate-500">
              Click any patient to view details
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <DataTable columns={patientColumns} data={patientData} />
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

        <span className="text-xs font-medium text-slate-500">
          Updated today
        </span>
      </div>
    </div>
  );
}
