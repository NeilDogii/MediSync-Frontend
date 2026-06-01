"use client";

import React, { useState } from "react";
import SidebarDoctor from "@/components/DoctorComponents/SidebarDoctor";
import { Eye, Download, CalendarDays } from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Type
type Report = {
  id: string;
  patient: string;
  initials: string;
  type: string;
  date: string;
  status: "Pending" | "Ready" | "Viewed";
  details: string;
};

// Sample Data
const sampleReports: Report[] = [
  {
    id: "1",
    patient: "Amit Sharma",
    initials: "AS",
    type: "Blood Test",
    date: "2025-02-10",
    status: "Ready",
    details: "Blood report showing Hemoglobin levels and CBC analysis.",
  },
  {
    id: "2",
    patient: "Sara Kapoor",
    initials: "SK",
    type: "X-Ray Scan",
    date: "2025-02-09",
    status: "Viewed",
    details: "Chest X-ray indicates no abnormalities.",
  },
  {
    id: "3",
    patient: "John Mathew",
    initials: "JM",
    type: "MRI Brain",
    date: "2025-02-08",
    status: "Pending",
    details: "MRI scan scheduled; awaiting upload by radiology.",
  },
  {
    id: "4",
    patient: "Anjali Rao",
    initials: "AR",
    type: "Allergy Test",
    date: "2025-02-11",
    status: "Ready",
    details: "Test shows mild reaction to dust and pollen allergens.",
  },
];

const statusColors: Record<Report["status"], string> = {
  Ready: "bg-green-100 text-green-700",
  Viewed: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export default function ReportsDoctor() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);
  const [search, setSearch] = useState("");

  const filteredReports = sampleReports.filter(
    (rep) =>
      rep.patient.toLowerCase().includes(search.toLowerCase()) ||
      rep.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <SidebarDoctor />

      <div className="ml-64 min-h-screen p-8 bg-[#D2F0F6]">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
        <p className="text-gray-600 mb-8">
          Track and review all patient reports uploaded to the system.
        </p>

        {/* Search Input */}
        <div className="flex justify-end mb-5">
          <Input
            type="text"
            placeholder="Search reports..."
            className="w-72 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Patient</TableHead>
                <TableHead className="font-semibold">Report Type</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredReports.map((rep) => (
                <TableRow key={rep.id}>
                  {/* Patient Info */}
                  <TableCell className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {rep.initials}
                    </div>
                    {rep.patient}
                  </TableCell>

                  <TableCell>{rep.type}</TableCell>

                  {/* Date */}
                  <TableCell className="flex items-center gap-1">
                    <CalendarDays size={16} />
                    {rep.date}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[rep.status]
                      }`}
                    >
                      {rep.status}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right flex justify-end gap-3">
                    {/* View Button */}
                    <Button
                      size="icon"
                      className="bg-[#0077B6] hover:bg-[#005f8c]"
                      onClick={() => {
                        setSelected(rep);
                        setOpen(true);
                      }}
                    >
                      <Eye size={18} />
                    </Button>

                    {/* Download Button */}
                    <Button
                      size="icon"
                      variant="outline"
                      className="hover:bg-gray-100"
                    >
                      <Download size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* REPORT VIEW MODAL */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {selected?.type}
              </DialogTitle>
              <DialogDescription>
                Report details for <strong>{selected?.patient}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-2 text-gray-800">
              <p>
                <strong>Date:</strong> {selected?.date}
              </p>
              <p>
                <strong>Status:</strong> {selected?.status}
              </p>
              <p className="pt-2">{selected?.details}</p>
            </div>

            <DialogFooter>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
