"use client";

import React, { useState } from "react";

import {
  Eye,
  Download,
  CalendarDays,
  ClipboardListIcon,
  ClipboardCheckIcon,
  ClipboardClockIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Appointment } from "@/@types/appointment";

// Type
type Report = {
  id: string;
  patient: string;
  initials: string;
  type: string;
  date: string;
  status: "Pending" | "Ready" | "Viewed";
  details: string;
  remedies: string;
  condition: string;
};

// Sample Data
// const sampleReports: Report[] = [
//   {
//     id: "1",
//     patient: "Amit Sharma",
//     initials: "AS",
//     type: "Blood Test",
//     date: "2025-02-10",
//     status: "Ready",
//     details: "Blood report showing Hemoglobin levels and CBC analysis.",
//   },
//   {
//     id: "2",
//     patient: "Sara Kapoor",
//     initials: "SK",
//     type: "X-Ray Scan",
//     date: "2025-02-09",
//     status: "Viewed",
//     details: "Chest X-ray indicates no abnormalities.",
//   },
//   {
//     id: "3",
//     patient: "John Mathew",
//     initials: "JM",
//     type: "MRI Brain",
//     date: "2025-02-08",
//     status: "Pending",
//     details: "MRI scan scheduled; awaiting upload by radiology.",
//   },
//   {
//     id: "4",
//     patient: "Anjali Rao",
//     initials: "AR",
//     type: "Allergy Test",
//     date: "2025-02-11",
//     status: "Ready",
//     details: "Test shows mild reaction to dust and pollen allergens.",
//   },
// ];

const downloadReportAsPDF = async (appointment: Appointment) => {
  if (!appointment.report) {
    alert("No report available for this appointment");
    return;
  }

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
  }
};

const statusColors: Record<Report["status"], string> = {
  Ready: "bg-green-100 text-green-700",
  Viewed: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export default function DoctorReports({
  data,
}: {
  data: {
    condition: string;
    fullReport: string;
    remedies: string;
    date: string;
    id: string;
    appointment: Partial<Appointment>;
  }[];
}) {
  const sampleReports = data.map((item) => ({
    id: item.id,
    patient: item.appointment?.patient?.name || "Unknown Patient",
    initials: item.appointment?.patient?.name
      ? item.appointment.patient.name
          .split(" ")
          .map((n) => n.charAt(0))
          .join("")
          .toLocaleUpperCase()
      : "UP",
    type: item.condition,
    date: item.date,
    status: "Ready" as "Ready" | "Pending" | "Viewed",
    details: item.fullReport,
    remedies: item.remedies,
    condition: item.condition,
    appointment: { ...item.appointment, report: item } as Appointment,
  }));
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);
  const [search, setSearch] = useState("");

  const filteredReports = sampleReports.filter(
    (rep) =>
      rep.patient.toLowerCase().includes(search.toLowerCase()) ||
      rep.type.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="ml-64 min-h-screen bg-slate-50 p-8">
        {/* Hero */}

        <div className="mb-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F4C81] via-[#0B6CB8] to-[#38BDF8] p-8 shadow-xl">
            <div className="relative z-10">
              <p className="text-blue-100 text-sm mb-2">Doctor Portal</p>

              <h1 className="text-4xl font-bold text-white">Medical Reports</h1>

              <p className="text-blue-100 mt-2">
                Access, review and manage patient reports.
              </p>
            </div>

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Reports"
            value={sampleReports.length}
            icon={<ClipboardListIcon size={22} />}
          />

          <StatCard
            title="Ready Reports"
            value={sampleReports.filter((r) => r.status === "Ready").length}
            icon={<ClipboardCheckIcon size={22} />}
          />

          <StatCard
            title="Pending Reports"
            value={sampleReports.filter((r) => r.status === "Pending").length}
            icon={<ClipboardClockIcon size={22} />}
          />
        </div>

        {/* Search */}

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mb-8">
          <Input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-2xl"
          />
        </div>

        {/* Reports */}

        {filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center">
            <h3 className="text-lg font-semibold">No Reports Found</h3>

            <p className="text-slate-500 mt-2">No reports match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                      {report.initials}
                    </div>

                    <div>
                      <h3 className="capitalize font-bold text-lg text-slate-900">
                        {report.patient}
                      </h3>

                      <p className="text-slate-500">{report.type}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[report.status]
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <CalendarDays size={15} />
                    {new Date(report.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                    {report.details}
                  </p>
                </div>

                <div className="flex gap-3 mt-5">
                  <Button
                    className="flex-1 bg-[#0B6CB8] hover:bg-[#095a9c]"
                    onClick={() => {
                      setSelected({
                        ...report,
                        date: new Date(report.date).toISOString(),
                      });
                      setOpen(true);
                    }}
                  >
                    <Eye size={16} />
                    View Report
                  </Button>

                  <Button
                    role="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => downloadReportAsPDF(report.appointment!)}
                  >
                    <Download size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selected?.type}</DialogTitle>

              <DialogDescription>
                Report details for <strong>{selected?.patient}</strong>
              </DialogDescription>
            </DialogHeader>

            {selected && (
              <div className="space-y-5 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <ReportDetail label="Patient" value={selected.patient} />

                  <ReportDetail label="Status" value={selected.status} />

                  <ReportDetail label="Condition" value={selected.type} />

                  <ReportDetail
                    label="Date"
                    value={new Date(selected.date).toLocaleDateString("en-IN")}
                  />
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">
                    Patient&apos;s Condition
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700">
                    {selected.condition}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">Full Report</p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700">
                    {selected.details}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">Remedies</p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700">
                    {selected.remedies}
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Close
                  </Button>

                  <Button className="bg-[#0B6CB8]">
                    <Download size={16} />
                    Download
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
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

function ReportDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>

      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}
