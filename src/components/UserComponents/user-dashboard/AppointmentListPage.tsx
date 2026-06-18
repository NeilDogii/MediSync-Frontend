"use client";

import Navbar from "@/components/UserComponents/Navbar";
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
  Download,
} from "lucide-react";
import { fetchMeetingToken } from "@/utils/requests/appointment/appointments";

export default function AppointmentsPage({ userId }: { userId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

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
        },
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

  const downloadReportAsPDF = async (appointment: Appointment) => {
    if (!appointment.report) {
      alert("No report available for this appointment");
      return;
    }

    setDownloadingId(appointment.id);

    try {
      const { jsPDF } = await import("jspdf");

      const reportDate = new Date(appointment.report.date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      );

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      let y = 0;

      // =================================
      // HEADER
      // =================================

      pdf.setFillColor(15, 108, 189);
      pdf.rect(0, 0, pageWidth, 22, "F");

      pdf.setTextColor(255, 255, 255);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("MEDISYNC", 14, 14);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Professional Medical Consultation Report", 14, 19);

      y = 30;

      // =================================
      // INFO TABLE
      // =================================

      pdf.setDrawColor(220, 225, 230);
      pdf.setFillColor(248, 250, 252);

      pdf.roundedRect(10, y, pageWidth - 20, 28, 2, 2, "FD");

      // Vertical divider
      pdf.line(pageWidth / 2, y, pageWidth / 2, y + 28);

      // Horizontal divider
      pdf.line(10, y + 14, pageWidth - 10, y + 14);

      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.setFont("helvetica", "bold");

      pdf.text("PATIENT", 14, y + 6);
      pdf.text("DOCTOR", pageWidth / 2 + 4, y + 6);
      pdf.text("DATE", 14, y + 20);
      pdf.text("REPORT ID", pageWidth / 2 + 4, y + 20);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      pdf.text(appointment.patient?.name || "N/A", 14, y + 11);

      pdf.text(appointment.doctor?.name || "N/A", pageWidth / 2 + 4, y + 11);

      pdf.text(reportDate, 14, y + 25);

      pdf.text(`${appointment.report.id}`, pageWidth / 2 + 4, y + 25);

      y += 36;

      // =================================
      // SECTION HELPER
      // =================================

      const drawSection = (
        title: string,
        content: string,
        bgColor: [number, number, number],
      ) => {
        const lines = pdf.splitTextToSize(content || "N/A", pageWidth - 24);

        const contentHeight = Math.max(12, lines.length * 4.2 + 6);

        // page break
        if (y + contentHeight + 15 > pageHeight - 20) {
          pdf.addPage();
          y = 15;
        }

        // title strip
        pdf.setFillColor(15, 108, 189);
        pdf.rect(10, y, pageWidth - 20, 6, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);

        pdf.text(title, 13, y + 4.2);

        y += 6;

        // content box
        pdf.setFillColor(...bgColor);
        pdf.setDrawColor(225, 225, 225);

        pdf.rect(10, y, pageWidth - 20, contentHeight, "FD");

        pdf.setTextColor(40, 40, 40);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);

        pdf.text(lines, 13, y + 5);

        y += contentHeight + 5;
      };

      // =================================
      // REPORT CONTENT
      // =================================

      drawSection(
        "PATIENT PROVIDED SYMPTOMS",
        appointment.condition || "N/A",
        [250, 250, 250],
      );

      drawSection(
        "DOCTOR ASSESSMENT",
        appointment.report.condition || "N/A",
        [239, 246, 255],
      );

      drawSection(
        "DETAILED MEDICAL REPORT",
        appointment.report.fullReport || "N/A",
        [255, 255, 255],
      );

      drawSection(
        "RECOMMENDED REMEDIES & CARE PLAN",
        appointment.report.remedies || "N/A",
        [240, 253, 244],
      );

      // =================================
      // FOOTER
      // =================================

      const footerY = pageHeight - 10;

      pdf.setDrawColor(220, 220, 220);
      pdf.line(10, footerY - 4, pageWidth - 10, footerY - 4);

      pdf.setFontSize(7.5);
      pdf.setTextColor(120, 120, 120);

      pdf.text("Generated by MediSync Healthcare Platform", 10, footerY);

      pdf.text(`${appointment.report.id}`, pageWidth - 60, footerY);

      pdf.save(`Medical-Report-${appointment.patient?.name || "Patient"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    } finally {
      setDownloadingId(null);
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
      <div className="pt-7 px-8 pb-10 ">
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
                                },
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
                            appointment.status,
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
                          onClick={async () => {
                            // Placeholder for meeting logic
                            const { token } = await fetchMeetingToken({
                              appointmentId: appointment.id,
                              type: "patient",
                            });
                            window.open(`/conference?token=${token}`, "_blank");
                          }}
                          className="bg-gradient-to-r from-[#0074cc] to-[#005fa3] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all whitespace-nowrap"
                        >
                          <Video size={18} />
                          Join Meeting
                        </button>

                        {/* Download Report Button */}
                        <button
                          onClick={() => downloadReportAsPDF(appointment)}
                          disabled={
                            !appointment.report ||
                            downloadingId === appointment.id
                          }
                          className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                            appointment.report
                              ? "bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white hover:shadow-lg"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Download size={18} />
                          {downloadingId === appointment.id
                            ? "Generating..."
                            : "Download Report"}
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
                              appointment.createdAt,
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
