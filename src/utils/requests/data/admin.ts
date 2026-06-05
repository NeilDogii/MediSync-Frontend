"use server";

import { Doctor, DoctorReport } from "@/@types/doctor";
import { Patient } from "@/@types/patient";
import { API } from "@/constants/environment/variables";
import { revalidateTag } from "next/cache";

export async function fetchAdmin(adminId: number): Promise<{
  id: number;
  username: string;
}> {
  const response = await fetch(`${API}/admin/admin/${adminId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["cache", "admin"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch admin.");
  }

  const data = await response.json();
  return data;
}

export async function fetchDoctors(): Promise<Doctor[]> {
  const response = await fetch(`${API}/admin/doctors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["cache", "doctors"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch doctors.");
  }

  const data = await response.json();
  return data;
}

export async function createDoctor({
  data,
}: {
  data: Omit<Partial<Doctor>, "id" | "isActive">;
}) {
  const response = await fetch(`${API}/admin/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData.message || "Failed to create doctor.");
    return {
      success: false,
      message: errorData.message || "Failed to create doctor.",
    };
  }
  const result = await response.json();
  revalidateTag("doctors");
  return {
    success: true,
    data: result,
  };
}

export async function updateDoctor({
  id,
  data,
}: {
  id: string;
  data: Omit<Partial<Doctor>, "id" | "isActive">;
}) {
  const response = await fetch(`${API}/admin/doctors/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData.message || "Failed to update doctor.");
    return {
      success: false,
      message: errorData.message || "Failed to update doctor.",
    };
  }
  revalidateTag("doctors");
  const result = await response.json();
  return {
    success: true,
    data: result,
  };
}

export async function updateAdmin({
  id,
  data,
}: {
  id: number;
  data: {
    username?: string;
    password?: string;
  };
}) {
  const response = await fetch(`${API}/admin/admin/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData.message || "Failed to update admin.");
    return {
      success: false,
      message: errorData.message || "Failed to update admin.",
    };
  }
  revalidateTag("admin");
  const result = await response.json();
  return {
    success: true,
    data: result,
  };
}


export async function deleteDoctor({ id }: { id: string }) {
  const response = await fetch(`${API}/admin/doctors/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData.message || "Failed to delete doctor.");
    return {
      success: false,
      message: errorData.message || "Failed to delete doctor.",
    };
  }
  revalidateTag("doctors");
  const result = await response.json();
  return {
    success: true,
    data: result,
  };
}

export async function fetchPatients(): Promise<Patient[]> {
  const response = await fetch(`${API}/admin/patients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["cache", "patients"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch patients.");
  }

  const data = await response.json();
  return data;
}

export async function fetchReports(): Promise<DoctorReport[]> {
  const response = await fetch(`${API}/admin/reports`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["cache", "admin"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch reports.");
  }

  const data = await response.json();
  return data;
}