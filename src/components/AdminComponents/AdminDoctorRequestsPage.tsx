"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";

interface DoctorRequest {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  specialization: string;
  fees?: number;
  status: string;
}

interface Props {
  data: DoctorRequest[];
}

export default function AdminDoctorRequestsPage({ data }: Props) {
  const [requests, setRequests] = useState(data);

  const handleApprove = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/doctor-requests/${id}/approve`,
        {
          method: "PATCH",
        },
      );

      setRequests((prev) => prev.filter((doctor) => doctor.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/doctor-requests/${id}/reject`,
        {
          method: "PATCH",
        },
      );

      setRequests((prev) => prev.filter((doctor) => doctor.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-slate-50 p-6">
      <div className="bg-gradient-to-r from-[#065F46] via-[#10B981] to-[#6EE7B7] rounded-3xl p-8 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-100 text-sm mb-1">Admin Portal</p>
          <h1 className="text-4xl font-bold text-white mb-2">
            Doctor Requests
          </h1>
          <p className="text-blue-100">
            Review and approve doctor registrations
          </p>
        </div>

        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute right-20 bottom-0 w-40 h-40 bg-white/10 rounded-full -mb-16" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#047857] to-[#34D399] flex items-center justify-center">
              {" "}
              <UserPlus className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Pending Requests
              </h2>
              <p className="text-sm text-slate-500">
                Click approve or reject to process a request.
              </p>
            </div>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No pending doctor requests
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Username</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Specialization</th>
                  <th className="px-6 py-4 text-left">Fees</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((doctor) => (
                  <tr key={doctor.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">{doctor.name}</td>
                    <td className="px-6 py-4">{doctor.username}</td>
                    <td className="px-6 py-4">{doctor.email}</td>
                    <td className="px-6 py-4">{doctor.phone}</td>

                    <td className="px-6 py-4">
                      {doctor.specialization.replaceAll("_", " ").toLowerCase()}
                    </td>

                    <td className="px-6 py-4">₹{doctor.fees || 0}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleApprove(doctor.id)}
                          className="px-4 py-2 rounded-xl    bg-emerald-700
    text-white
    hover:bg-emerald-800
    transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(doctor.id)}
                          className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-400"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
