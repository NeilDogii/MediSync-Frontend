"use client";

import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Patient } from "@/@types/patient";
import { fetchDoctorAppointments } from "@/utils/requests/appointment/appointments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getCookie } from "@/utils/cookie";
import {
  Search,
  Users,
  UserCheck,
  Calendar,
  Eye,
  Mail,
  Phone,
  Dot,
} from "lucide-react";

interface PatientWithDetails extends Patient {
  condition?: string;
  lastVisit?: string;
}

export default function MyPatients() {
  const [patients, setPatients] = useState<PatientWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PatientWithDetails | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [doctorId, setDoctorId] = useState<number | null>(null);

  const extractDoctorIdFromToken = (token: string): number | null => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Invalid JWT token format");
        return null;
      }
      const payload = JSON.parse(atob(parts[1]));
      return payload.id || payload.doctorId || payload.userId || null;
    } catch (error) {
      console.error("Error extracting doctor ID from token:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadDoctorId = async () => {
      const token = await getCookie("__doctor_token__");
      if (token) {
        const id = extractDoctorIdFromToken(token);
        if (id) {
          setDoctorId(id);
        }
      }
    };
    loadDoctorId();
  }, []);

  useEffect(() => {
    if (doctorId) {
      const loadPatients = async () => {
        setLoading(true);
        const appointments = await fetchDoctorAppointments({ doctorId });

        const patientsMap = new Map<string, PatientWithDetails>();

        appointments.forEach((appointment) => {
          const patientKey =
            appointment.patient?.email ||
            appointment.patient?.name ||
            "unknown";
          if (appointment.patient && patientKey) {
            if (!patientsMap.has(patientKey)) {
              patientsMap.set(patientKey, {
                id: 0,
                name: appointment.patient.name || "",
                email: appointment.patient.email || "",
                phone: appointment.patient.phone || "",
                gender: appointment.patient.gender as Patient["gender"],
                age: appointment.patient.age,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                condition: appointment.condition,
                lastVisit: appointment.date,
              });
            } else {
              // Update with the most recent visit
              const existing = patientsMap.get(patientKey)!;
              if (
                new Date(appointment.date) > new Date(existing.lastVisit || "")
              ) {
                existing.lastVisit = appointment.date;
              }
            }
          }
        });

        const patientsArray = Array.from(patientsMap.values());
        setPatients(patientsArray);
        setLoading(false);
      };

      loadPatients();
    }
  }, [doctorId]);

  // Filter based on search input
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="ml-64 min-h-screen bg-slate-50 p-8">
        {/* Hero */}

        <div className="mb-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F4C81] via-[#0B6CB8] to-[#38BDF8] p-8 shadow-xl">
            <div className="relative z-10">
              <p className="text-blue-100 text-sm mb-2">Doctor Portal</p>

              <h1 className="text-4xl font-bold text-white">My Patients</h1>

              <p className="text-blue-100 mt-2">
                View and manage all patient records and visits.
              </p>
            </div>

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Overview */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Patients"
            value={patients.length}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Active Patients"
            value={patients.length}
            icon={<UserCheck size={22} />}
          />

          <StatCard
            title="Recent Visits"
            value={patients.filter((p) => p.lastVisit).length}
            icon={<Calendar size={22} />}
          />
        </div>

        {/* Search */}

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mb-8">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-slate-400"
            />

            <Input
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 rounded-2xl border-slate-200"
            />
          </div>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-12 w-12 rounded-full border-b-2 border-[#0B6CB8] animate-spin" />
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />

            <h3 className="font-semibold text-lg">No Patients Found</h3>

            <p className="text-slate-500 mt-2">
              No patients match your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredPatients.map((patient) => (
              <div
                key={patient.email}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] flex items-center justify-center text-white text-xl font-bold shadow-lg capitalize">
                      {patient.name?.charAt(0)}
                    </div>

                    <div>
                      <h3 className="capitalize font-bold text-lg text-slate-900">
                        {patient.name}
                      </h3>

                      <div className="flex gap-4 mt-1.5 text-sm text-slate-500">
                        <span>{patient.age || "N/A"} yrs</span>

                        <span>{patient.gender || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelected(patient);
                      setOpenDialog(true);
                    }}
                    className="rounded-xl bg-[#0B6CB8] hover:bg-[#095a9c]"
                  >
                    <Eye size={16} />
                  </Button>
                </div>

                <div className="border-t flex items-center gap-3   border-slate-100 mt-5 pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={14} />
                    {patient.email}
                  </div>

                  <Dot size={20} className="text-slate-400" />

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} />
                    {patient.phone}
                  </div>

                  {patient.lastVisit && (
                    <div className="text-sm ml-auto text-slate-500">
                      Last Visit: {new Date(patient.lastVisit).toDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selected?.name}</DialogTitle>

            <DialogDescription>
              Patient details and medical information.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  label="Age"
                  value={`${selected.age || "N/A"} years`}
                />

                <DetailItem label="Gender" value={selected.gender || "N/A"} />

                <DetailItem label="Email" value={selected.email} />

                <DetailItem label="Phone" value={selected.phone} />
              </div>

              {selected.lastVisit && (
                <DetailItem
                  label="Last Visit"
                  value={new Date(selected.lastVisit).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                />
              )}

              {selected.condition && (
                <DetailItem
                  label="Recent Condition"
                  value={selected.condition}
                />
              )}

              <Button
                onClick={() => setOpenDialog(false)}
                className="w-full bg-[#0B6CB8]"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>

      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}
