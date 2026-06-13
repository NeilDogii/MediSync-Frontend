"use client";
import React, { useState } from "react";
import { EyeIcon, FileText, X } from "lucide-react";
import { DoctorReport } from "@/@types/doctor";
import Popup from "../global/Popup";

export default function AdminReportsPage({
  reports,
}: {
  reports: DoctorReport[];
}) {
  const [selected, setSelected] = useState<DoctorReport | null>(null);

  //   const reports: Report[] = [
  //     {
  //       id: "1",
  //       condition: "Fever",
  //       fullReport: "Patient shows viral symptoms. Rest and hydration advised.",
  //       remedies: "Paracetamol + Fluids",
  //       date: "2026-06-01",

  //       appointment: {
  //         doctor: {
  //           name: "Dr Smith",
  //         },

  //         patient: {
  //           name: "John Doe",
  //         },
  //       },
  //     },

  //     {
  //       id: "2",
  //       condition: "Migraine",
  //       fullReport: "Recurring headaches. Neurological examination normal.",

  //       remedies: "Sleep + medication",

  //       date: "2026-06-03",

  //       appointment: {
  //         doctor: {
  //           name: "Dr Emily",
  //         },

  //         patient: {
  //           name: "Sarah",
  //         },
  //       },
  //     },
  //   ];

  return (
    <div className="ml-64 min-h-screen bg-slate-50 p-8">
      {/* HERO */}
      <div className="mb-8">
        <div className="rounded-[32px] bg-gradient-to-r from-[#065F46] via-[#10B981] to-[#6EE7B7] p-8">
          <p className="text-blue-100 text-sm">Admin Portal</p>

          <h1 className="text-4xl font-bold text-white">Doctor Reports</h1>

          <p className="text-blue-100 mt-2">
            View medical reports submitted by doctors.
          </p>
        </div>
      </div>

      {/* REPORT TABLE */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#047857] to-[#34D399] flex items-center justify-center text-white">
            {" "}
            <FileText />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Issued Reports</h2>

            <p className="text-sm text-slate-500">
              Click any report to view details
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Doctor</th>

                <th className="p-4 text-left">Patient</th>

                <th className="p-4 text-left">Diagnosis</th>

                <th className="p-4 text-left">Date</th>

                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">
                    {report.appointment?.doctor?.name || "-"}
                  </td>

                  <td className="p-4">
                    {report.appointment?.patient?.name || "-"}
                  </td>

                  <td className="p-4">{report.condition}</td>

                  <td className="p-4">
                    {new Date(report.date).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex items-center justify-center">
                    <button
                      onClick={() => setSelected(report)}
                      className="
                        px-4
                        py-2
                        rounded-xl
                          bg-emerald-600
  hover:bg-emerald-700
  text-white
  transition

                      "
                    >
                      <EyeIcon
                        className="inline-block mr-2 -mt-0.5"
                        size={16}
                      />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <Popup showPopup={!!selected} onChangeShowPopup={() => setSelected(null)}>
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[700px] rounded-3xl bg-white p-8 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-6 top-6"
            >
              <X />
            </button>

            <h2 className="text-3xl font-bold mb-6">Medical Report</h2>

            <div className="space-y-4">
              <Info
                label="Doctor"
                value={selected?.appointment?.doctor?.name || "-"}
              />

              <Info
                label="Patient"
                value={selected?.appointment?.patient?.name || "-"}
              />

              <Info label="Diagnosis" value={selected?.condition || "-"} />

              <Info label="Report" value={selected?.fullReport || "-"} />

              <Info label="Remedies" value={selected?.remedies || "-"} />
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>

      <p className="font-medium">{value}</p>
    </div>
  );
}
