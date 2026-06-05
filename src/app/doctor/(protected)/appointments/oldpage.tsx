"use client";

import React, { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarDays, Clock } from "lucide-react";
import { Appointment } from "@/@types/appointment";
import {
  fetchAppointments,
  fetchMeetingToken,
  updateAppointment,
  createReport,
  updateReport,
} from "@/utils/requests/appointment/appointments";
import { getCookie } from "@/utils/cookie";

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  RESCHEDULED: "bg-yellow-100 text-yellow-700",
};

const statusLabels: Record<string, string> = {
  SCHEDULED: "Upcoming",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RESCHEDULED: "Rescheduled",
};

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [open, setOpen] = useState(false);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSelected, setReportSelected] = useState<Appointment | null>(
    null,
  );
  const [reportForm, setReportForm] = useState({
    condition: "",
    fullReport: "",
    remedies: "",
  });
  const [submittingReport, setSubmittingReport] = useState(false);

  // Extract doctor ID from JWT token
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
      const loadAppointments = async () => {
        setLoading(true);
        const data = await fetchAppointments({ doctorId });
        console.log(data);
        setAppointments(data);
        setLoading(false);
      };
      loadAppointments();
    }
  }, [doctorId]);

  const handleStatusChange = async (
    appointment: Appointment,
    newStatus: string,
  ) => {
    const updated = await updateAppointment({
      appointmentId: appointment.id,
      data: { status: newStatus },
    });
    if (updated) {
      if (!appointments) return;
      setAppointments(
        appointments.map((a) =>
          a.id === appointment.id ? { ...a, status: newStatus } : a,
        ),
      );
      setOpen(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupedAppointments = {
    SCHEDULED: appointments?.filter((a) => a.status === "SCHEDULED") || [],
    COMPLETED: appointments?.filter((a) => a.status === "COMPLETED") || [],
    CANCELLED: appointments?.filter((a) => a.status === "CANCELLED") || [],
  };

  const startMeeting = async (appointmentId: number) => {
    const { token } = await fetchMeetingToken({
      appointmentId,
      type: "doctor",
    });
    if (!token) return alert("Error starting meeting. Please try again.");
    window.open(`/conference?token=${token}`, "_blank");
  };

  const handleReportOpen = (appointment: Appointment) => {
    setReportSelected(appointment);
    if (appointment.report && appointment.report.condition) {
      setReportForm({
        condition: appointment.report.condition || "",
        fullReport: appointment.report.fullReport || "",
        remedies: appointment.report.remedies || "",
      });
    } else {
      setReportForm({
        condition: "",
        fullReport: "",
        remedies: "",
      });
    }
    setReportOpen(true);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportSelected) return;

    setSubmittingReport(true);
    try {
      const reportData = {
        condition: reportForm.condition,
        fullReport: reportForm.fullReport,
        remedies: reportForm.remedies,
        date: new Date().toISOString(),
      };

      if (reportSelected.report && reportSelected.report.condition) {
        await updateReport({
          appointmentId: reportSelected.id,
          data: reportData,
        });
      } else {
        await createReport({
          appointmentId: reportSelected.id,
          data: reportData,
        });
      }

      // Update local appointments state
      if (appointments) {
        setAppointments(
          appointments.map((a) =>
            a.id === reportSelected.id ? { ...a, report: reportData } : a,
          ),
        );
      }

      setReportOpen(false);
      setReportForm({ condition: "", fullReport: "", remedies: "" });
      setReportSelected(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Error submitting report. Please try again.");
    } finally {
      setSubmittingReport(false);
    }
  };

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: Appointment[];
  }) => (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {items.length === 0 && (
        <p className="text-gray-500 text-sm">No {title.toLowerCase()}.</p>
      )}

      <div className="space-y-4">
        {items.map((appt) => (
          <Card key={appt.id} className="shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              {/* Patient Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                  {appt.patient?.name?.charAt(0) || "P"}
                </div>

                <div>
                  <p className="text-lg font-semibold">
                    {appt.patient?.name || "Unknown Patient"}
                  </p>
                  <p className="text-sm text-gray-500">{appt.condition}</p>
                </div>
              </div>

              {/* Date + Time */}
              <div className="flex flex-col text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <Clock size={16} /> {formatTime(appt.date)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <CalendarDays size={16} /> {formatDate(appt.date)}
                </div>
              </div>

              {/* Status */}
              <Badge className={`${statusColors[appt.status]} px-3 py-1`}>
                {statusLabels[appt.status]}
              </Badge>

              <div className="flex items-center gap-3">
                {/* JOIN MEET BUTTON */}
                <Button
                  onClick={() => {
                    startMeeting(appt.id);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Join Meeting
                </Button>

                {/* REPORT BUTTON */}
                <Button
                  onClick={() => handleReportOpen(appt)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {appt.report && appt.report.condition
                    ? "Update Report"
                    : "Attach Report"}
                </Button>

                {/* View Button */}
                <Button
                  onClick={() => {
                    setSelected(appt);
                    setOpen(true);
                  }}
                  className="bg-[#0077B6] hover:bg-[#005f8c]"
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex">
        <div className="ml-64 min-h-screen p-8 bg-[#D2F0F6] flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077B6]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ml-64 min-h-screen p-8 bg-[#D2F0F6]">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600 mb-6">
          View and manage all your upcoming and past consultations.
        </p>

        <Card className="p-6 shadow-lg">
          <Section
            title="Upcoming Appointments"
            items={groupedAppointments.SCHEDULED}
          />
          <Section
            title="Completed Appointments"
            items={groupedAppointments.COMPLETED}
          />
          <Section
            title="Cancelled Appointments"
            items={groupedAppointments.CANCELLED}
          />
        </Card>

        {/* VIEW MODAL */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>{selected?.patient?.name}</DialogTitle>
              <DialogDescription>
                Appointment details and patient information.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-gray-800 mt-3">
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <p className="font-semibold">{selected?.condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-semibold">
                  {selected &&
                    `${formatDate(selected.date)}, ${formatTime(
                      selected.date,
                    )}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient Email</p>
                <p className="font-semibold">{selected?.patient?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient Phone</p>
                <p className="font-semibold">{selected?.patient?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient Age & Gender</p>
                <p className="font-semibold">
                  {selected?.patient?.age || "N/A"} years,{" "}
                  {selected?.patient?.gender || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-semibold">
                  {selected?.isPaid ? "✅ Paid" : "❌ Not Paid"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold">
                  {statusLabels[selected?.status || ""]}
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              {selected?.status === "SCHEDULED" && (
                <>
                  <Button
                    onClick={() => handleStatusChange(selected, "COMPLETED")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark Completed
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selected, "CANCELLED")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Cancel
                  </Button>
                </>
              )}
              <Button onClick={() => setOpen(false)} className="bg-gray-400">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* REPORT MODAL */}
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <DialogContent className="rounded-2xl max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {reportSelected?.report && reportSelected.report.condition
                  ? "Update Report"
                  : "Attach Report"}
              </DialogTitle>
              <DialogDescription>
                Create or update medical report for{" "}
                {reportSelected?.patient?.name}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleReportSubmit} className="space-y-4 mt-3">
              {/* Condition Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <input
                  type="text"
                  value={reportForm.condition}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      condition: e.target.value,
                    })
                  }
                  placeholder="Enter patient condition"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Full Report Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Report
                </label>
                <textarea
                  value={reportForm.fullReport}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      fullReport: e.target.value,
                    })
                  }
                  placeholder="Enter detailed medical report..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  required
                />
              </div>

              {/* Remedies Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remedies
                </label>
                <textarea
                  value={reportForm.remedies}
                  onChange={(e) =>
                    setReportForm({
                      ...reportForm,
                      remedies: e.target.value,
                    })
                  }
                  placeholder="Enter recommended remedies and treatment plan..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  required
                />
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submittingReport}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {submittingReport
                    ? "Submitting..."
                    : reportSelected?.report && reportSelected.report.condition
                      ? "Update Report"
                      : "Create Report"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  className="bg-gray-400"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
