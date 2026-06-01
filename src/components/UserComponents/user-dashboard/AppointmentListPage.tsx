"use client";

import Navbar from "@/components/UserComponents/Navbar";
import UserSidebar from "@/components/UserComponents/UserSidebar";
import { useEffect, useState } from "react";
import { Appointment } from "@/@types/appointment";
import { getCookie } from "@/utils/cookie";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";
import { API } from "@/constants/environment/variables";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  AlertCircle,
  XCircle,
  Stethoscope,
} from "lucide-react";

export default function AppointmentsPage({ userId }: { userId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      const token = await getCookie(PATIENT_TOKEN_KEY);
      if (!token) return;

      const response = await fetch(
        `${API}/appointment/patient-appointments/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle size={20} />;
      case "confirmed":
        return <CheckCircle size={20} />;
      case "cancelled":
        return <XCircle size={20} />;
      case "pending":
        return <AlertCircle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const isAppointmentUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "upcoming") {
      return isAppointmentUpcoming(appointment.date);
    } else if (filter === "completed") {
      return !isAppointmentUpcoming(appointment.date);
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar isLoggedIn={true} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0074cc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
      <Navbar isLoggedIn={true} />
      <UserSidebar />
      <div className="pt-40 px-4 pb-10 md:ml-72 min-h-[calc(100vh-200px)]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              My Appointments
            </h1>
            <p className="text-gray-600">
              View and manage all your medical appointments
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8">
            {["all", "upcoming", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setFilter(tab as "all" | "upcoming" | "completed")
                }
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filter === tab
                    ? "bg-[#0074cc] text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#0074cc]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600 mb-6">
                You don&apos;t have any {filter !== "all" ? filter : ""}{" "}
                appointments at the moment.
              </p>
              <a href="/appointment" className="inline-block">
                <button className="bg-[#0074cc] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#005fa3] transition-colors">
                  Book an Appointment
                </button>
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      {/* Left Section - Main Details */}
                      <div className="flex-1 space-y-4">
                        {/* Date and Time */}
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Calendar size={20} className="text-[#0074cc]" />
                            <span className="font-semibold">
                              {new Date(appointment.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Clock size={20} className="text-[#0074cc]" />
                            <span className="font-semibold">
                              {appointment.date
                                .split("T")[1]
                                ?.substring(0, 5) || "Time not available"}
                            </span>
                          </div>
                        </div>

                        {/* Doctor Info */}
                        {appointment.doctor && (
                          <div className="flex items-center space-x-2 text-gray-700">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Stethoscope
                                size={20}
                                className="text-[#0074cc]"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Doctor</p>
                              <p className="font-semibold">
                                {appointment.doctor.name}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Condition */}
                        <div className="pt-2">
                          <p className="text-sm text-gray-600 mb-1">
                            Condition / Reason
                          </p>
                          <p className="text-gray-800 font-medium">
                            {appointment.condition || "General Checkup"}
                          </p>
                        </div>
                      </div>

                      {/* Right Section - Status and Actions */}
                      <div className="flex flex-col gap-4">
                        {/* Status Badge */}
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusIcon(appointment.status)}
                          <span>{appointment.status}</span>
                        </div>

                        {/* Payment Status */}
                        <div
                          className={`px-4 py-2 rounded-lg font-semibold text-center text-sm border ${
                            appointment.isPaid
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-orange-100 text-orange-700 border-orange-200"
                          }`}
                        >
                          {appointment.isPaid ? "Paid" : "Pending Payment"}
                        </div>

                        {/* Join Meeting Button */}
                        <button
                          onClick={() => {
                            // Placeholder for meeting logic
                            window.open(`https://meet.google.com/`, "_blank");
                          }}
                          className="bg-gradient-to-r from-[#0074cc] to-[#005fa3] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all whitespace-nowrap"
                        >
                          <Video size={18} />
                          Join Meeting
                        </button>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Appointment ID</p>
                          <p className="font-semibold text-gray-800">
                            #{appointment.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Amount</p>
                          <p className="font-semibold text-gray-800">
                            ₹{appointment.doctor?.fees || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Booked On</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(
                              appointment.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
