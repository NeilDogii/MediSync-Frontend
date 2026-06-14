"use server";

import { Appointment } from "@/@types/appointment";
import { Doctor } from "@/@types/doctor";
import { API } from "@/constants/environment/variables";
import { revalidateTag } from "next/cache";

export type DoctorDashboardData = {
  patientCount: number;
  totalVisitCount: number;
  pendingReportsCount: number;
  appointmentsTodayCount: number;
  upcomingAppointmentsCount: number;
  upcomingAppointments: {
    id: number;
    name: string;
    date: string;
  }[];

  recentPatients: {
    id: number;
    name: string;
    date: string;
  }[];

  pendingReports: {
    id: number;
    name: string;
    date: string;
  }[];
};

export async function fetchDoctor(doctorId: number): Promise<Doctor> {
  const response = await fetch(`${API}/misc/doctor/${doctorId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["cache", "doctors"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch doctor dashboard.");
  }

  const data = await response.json();
  return data;
}
export async function fetchDoctorDashboard(
  doctorId: number,
): Promise<DoctorDashboardData> {
  const response = await fetch(`${API}/misc/doctor-dashboard/${doctorId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["cache", "doctors"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch doctor dashboard.");
  }

  const data = await response.json();
  return data;
}

export async function updateDoctorSettings(
  doctorId: number,
  settings: Partial<Doctor>,
): Promise<Doctor> {
  const response = await fetch(`${API}/misc/doctor-settings/${doctorId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(settings),
    body: JSON.stringify({
      ...settings,
      fees: Number(settings.fees),
    }),
    next: { tags: ["cache", "doctors"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update doctor settings.");
  }

  const data = await response.json();
  revalidateTag("doctors");
  return data;
}

export async function fetchDoctorReports(doctorId: number): Promise<
  {
    id: string;
    condition: string;
    fullReport: string;
    remedies: string;
    date: string;
    appointmentId: number;
    appointment: Partial<Appointment>;
  }[]
> {
  const response = await fetch(`${API}/report/doctor-reports/${doctorId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["cache", "doctors"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch doctor reports.");
  }

  const data = await response.json();
  return data;
}

export async function uploadDoctorAvatar(formData: FormData): Promise<{
  url: string;
}> {
  const response = await fetch(`${API}/misc/doctor/upload-avatar`, {
    method: "POST",
    body: formData,
    next: { tags: ["cache", "doctors"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch doctor reports.");
  }

  const data = await response.json();
  return data;
}
