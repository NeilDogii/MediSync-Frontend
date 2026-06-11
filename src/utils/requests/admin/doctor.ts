"use server";

import { API } from "@/constants/environment/variables";

export async function fetchDoctorRequests() {
  const response = await fetch(`${API}/admin/doctor-requests`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doctor requests");
  }

  return response.json();
}

export async function approveDoctor(id: number) {
  const response = await fetch(`${API}/admin/doctor-requests/${id}/approve`, {
    method: "PATCH",
  });

  return response.json();
}

export async function rejectDoctor(id: number) {
  const response = await fetch(`${API}/admin/doctor-requests/${id}/reject`, {
    method: "PATCH",
  });

  return response.json();
}
