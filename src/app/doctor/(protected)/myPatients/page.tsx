"use client";

import React, { useEffect, useState } from "react";
import SidebarDoctor from "@/components/DoctorComponents/SidebarDoctor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Eye } from "lucide-react";
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
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex">
        <SidebarDoctor />

        <div className="flex-1 ml-64 min-h-screen bg-[#D2F0F6] p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Patients
            </h1>
            <p className="text-gray-600">Manage and view all your patients</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <Input
              placeholder="Search patients by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077B6]"></div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No patients found</p>
            </div>
          ) : (
            /* Table */
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#0077B6]">
                    <TableHead className="text-white">Patient Name</TableHead>
                    <TableHead className="text-white">Age</TableHead>
                    <TableHead className="text-white">Gender</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Phone</TableHead>
                    <TableHead className="text-white">Last Visit</TableHead>
                    <TableHead className="text-white">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-gray-50">
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#0077B6] text-white flex items-center justify-center font-bold">
                            {patient.name?.charAt(0) || "P"}
                          </div>
                          {patient.name}
                        </div>
                      </TableCell>
                      <TableCell>{patient.age || "N/A"}</TableCell>
                      <TableCell>{patient.gender || "N/A"}</TableCell>
                      <TableCell className="text-sm">{patient.email}</TableCell>
                      <TableCell className="text-sm">{patient.phone}</TableCell>
                      <TableCell className="text-sm">
                        {patient.lastVisit
                          ? new Date(patient.lastVisit).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setSelected(patient);
                            setOpenDialog(true);
                          }}
                          className="gap-2 bg-[#0077B6] hover:bg-[#005f8c]"
                          size="sm"
                        >
                          <Eye size={16} />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selected?.name}</DialogTitle>
            <DialogDescription>
              Patient information and details
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-semibold">{selected.age || "N/A"} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-semibold">{selected.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-sm">{selected.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold">{selected.phone}</p>
                </div>
              </div>

              {selected.lastVisit && (
                <div>
                  <p className="text-sm text-gray-500">Last Visit</p>
                  <p className="font-semibold">
                    {new Date(selected.lastVisit).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              {selected.condition && (
                <div>
                  <p className="text-sm text-gray-500">Last Condition</p>
                  <p className="font-semibold">{selected.condition}</p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  onClick={() => setOpenDialog(false)}
                  className="w-full bg-[#0077B6] hover:bg-[#005f8c]"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
