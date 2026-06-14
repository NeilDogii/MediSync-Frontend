"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { CalendarDays, CheckCheck, Plus, XIcon } from "lucide-react";
import { Appointment } from "@/@types/appointment";
import {
  fetchAppointments,
  fetchMeetingToken,
  updateAppointment,
  createReport,
  updateReport,
  createAppointment,
} from "@/utils/requests/appointment/appointments";
import { getCookie } from "@/utils/cookie";
import DoctorLoadingScreen from "@/components/DoctorComponents/DoctorLoadingScreen";
import { DOCTOR_TOKEN_KEY } from "@/constants/keys";

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

  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);
  const [submittingAppointment, setSubmittingAppointment] = useState(false);
  const [addForm, setAddForm] = useState({
    patientId: "",
    date: "",
    time: "",
    isPaid: false,
    condition: "",
  });

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
      const token = await getCookie(DOCTOR_TOKEN_KEY);
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
        setAppointments(data);
        setLoading(false);
      };
      loadAppointments();
    }
  }, [doctorId]);

  const uniquePatients = useMemo(() => {
    if (!appointments) return [];
    const patientMap = new Map();
    appointments.forEach((appt) => {
      if (appt.patient && !patientMap.has(appt.patient.id)) {
        patientMap.set(appt.patient.id, appt.patient);
      }
    });
    return Array.from(patientMap.values());
  }, [appointments]);

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAppointment(true);

    try {
      const combinedDateTime = new Date(
        `${addForm.date}T${addForm.time}`,
      ).toISOString();

      const response = await createAppointment({
        data: {
          doctorId: doctorId!,
          patientId: Number(addForm.patientId),
          date: new Date(combinedDateTime),
          isPaid: addForm.isPaid,
          isPaidToDoctor: addForm.isPaid,
          condition: addForm.condition,
          status: "SCHEDULED",
        },
      });

      if (!response) {
        alert("Error adding appointment.");
        return;
      }

      setAddAppointmentOpen(false);
      setAddForm({
        patientId: "",
        date: "",
        time: "",
        isPaid: false,
        condition: "",
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to add appointment", error);
      alert("Error adding appointment.");
    } finally {
      setSubmittingAppointment(false);
    }
  };

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
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-5">{title}</h2>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500">
          No appointments found.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((appt) => (
            <AppointmentRow key={appt.id} appointment={appt} />
          ))}
        </div>
      )}
    </div>
  );

  const AppointmentRow = ({ appointment }: { appointment: Appointment }) => {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {appointment.patient?.name?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                {appointment.patient?.name}
              </h3>
              <p className="text-slate-500">{appointment.condition}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase text-slate-400">Date</p>
              <p className="font-semibold">{formatDate(appointment.date)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Time</p>
              <p className="font-semibold">{formatTime(appointment.date)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Payment</p>
              <p className="font-semibold">
                {appointment.isPaid ? "Paid" : "Pending"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={`${statusColors[appointment.status]}`}>
              {statusLabels[appointment.status]}
            </Badge>

            <Button
              onClick={() => startMeeting(appointment.id)}
              className="rounded-xl bg-green-600 hover:bg-green-700"
            >
              Join Meeting
            </Button>

            <Button
              onClick={() => handleReportOpen(appointment)}
              className="rounded-xl bg-purple-600 hover:bg-purple-700"
            >
              {appointment.report ? "Update Report" : "Add Report"}
            </Button>

            <Button
              onClick={() => {
                setSelected(appointment);
                setOpen(true);
              }}
              className="rounded-xl bg-[#0B6CB8] hover:bg-[#095a9c]"
            >
              View
            </Button>
          </div>
        </div>
      </div>
    );
  };

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

  if (loading) {
    return <DoctorLoadingScreen />;
  }

  return (
    <>
      <div className="ml-64 min-h-screen bg-slate-50 p-8">
        {/* Hero */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F4C81] via-[#0B6CB8] to-[#38BDF8] p-8 shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-blue-100 text-sm mb-2">Doctor Portal</p>
                <h1 className="text-4xl font-bold text-white">
                  My Appointments
                </h1>
                <p className="text-blue-100 mt-2">
                  Manage consultations, reports and patient visits.
                </p>
              </div>

              {/* Add Appointment Trigger */}
              <button
                onClick={() => setAddAppointmentOpen(true)}
                className="flex items-center gap-2 bg-white text-[#0B6CB8] hover:bg-slate-50 hover:scale-105 transition-all duration-300 font-bold px-6 py-4 rounded-2xl shadow-lg relative z-10"
              >
                <Plus size={20} strokeWidth={2.5} />
                Add Appointment
              </button>
            </div>

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10 pointer-events-none" />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Upcoming"
            value={groupedAppointments.SCHEDULED.length}
            icon={<CalendarDays size={24} />}
          />
          <StatCard
            title="Completed"
            value={groupedAppointments.COMPLETED.length}
            icon={<CheckCheck size={24} />}
          />
          <StatCard
            title="Cancelled"
            value={groupedAppointments.CANCELLED.length}
            icon={<XIcon size={24} />}
          />
        </div>

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

        {/* --- VIEW APPOINTMENT MODAL --- */}
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

        {/* --- REPORT MODAL --- */}
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

        {/* --- ADD APPOINTMENT MODAL --- */}
        <Dialog open={addAppointmentOpen} onOpenChange={setAddAppointmentOpen}>
          <DialogContent className="rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
              <DialogDescription>
                Schedule a follow-up or new consultation with an existing
                patient.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddAppointment} className="space-y-4 mt-3">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Patient
                </label>
                <select
                  value={addForm.patientId}
                  onChange={(e) =>
                    setAddForm({ ...addForm, patientId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6CB8] bg-white"
                  required
                >
                  <option value="" disabled>
                    -- Select an existing patient --
                  </option>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {uniquePatients.map((patient: any) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.email || "No Email"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={addForm.date}
                    onChange={(e) =>
                      setAddForm({ ...addForm, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6CB8]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={addForm.time}
                    onChange={(e) =>
                      setAddForm({ ...addForm, time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6CB8]"
                    required
                  />
                </div>
              </div>

              {/* Condition / Problem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem / Symptoms
                </label>
                <textarea
                  value={addForm.condition}
                  onChange={(e) =>
                    setAddForm({ ...addForm, condition: e.target.value })
                  }
                  placeholder="e.g., Follow up on blood pressure..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6CB8] resize-none"
                  required
                />
              </div>

              {/* Payment Status Checkbox */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isPaidCheck"
                  checked={addForm.isPaid}
                  onChange={(e) =>
                    setAddForm({ ...addForm, isPaid: e.target.checked })
                  }
                  className="h-4 w-4 text-[#0B6CB8] focus:ring-[#0B6CB8] border-gray-300 rounded"
                />
                <label
                  htmlFor="isPaidCheck"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Mark as Paid
                </label>
              </div>

              <DialogFooter className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={submittingAppointment}
                  className="bg-[#0B6CB8] hover:bg-[#095a9c]"
                >
                  {submittingAppointment ? "Saving..." : "Create Appointment"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setAddAppointmentOpen(false)}
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
