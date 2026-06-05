"use server";

import { Appointment } from "@/@types/appointment";
import { Patient } from "@/@types/patient";
import { API } from "@/constants/environment/variables";

export async function fetchAppointments({
  doctorId,
}: {
  doctorId?: number;
}): Promise<Appointment[]> {
  try {
    const url = doctorId
      ? `${API}/appointment/${doctorId}`
      : `${API}/appointment/`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function fetchDoctorAppointments({
  doctorId,
}: {
  doctorId: number;
}): Promise<Appointment[]> {
  return fetchAppointments({ doctorId });
}

export async function fetchPatientsByDoctorId({
  doctorId,
}: {
  doctorId: number;
}): Promise<Partial<Patient>[]> {
  try {
    const response = await fetch(`${API}/appointment/patients/${doctorId}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching patients by doctor ID:", error);
    return [];
  }
}

export async function createAppointment({
  data,
}: {
  data: {
    condition: string;
    doctorId: number;
    patientId: number;
    date: Date;
    status?: string;
    isPaid?: boolean;
    isDoctorPaid?: boolean;
  };
}) {
  try {
    const response = await fetch(`${API}/appointment/`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating appointment:", error);
    return false;
  }
}

export async function updateAppointment({
  appointmentId,
  data,
}: {
  appointmentId: number;
  data: {
    condition?: string;
    doctorId?: number;
    patientId?: number;
    date?: string;
    status?: string;
    isPaid?: boolean;
    isPaidToDoctor?: boolean;
  };
}) {
  try {
    const response = await fetch(`${API}/appointment/${appointmentId}`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error("Error updating appointment:", error);
    return false;
  }
}

export async function fetchMeetingToken({
  appointmentId,
  type,
}: {
  appointmentId: number;
  type: "doctor" | "patient";
}) {
  try {
    const response = await fetch(`${API}/appointment/meeting-token`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appointmentId, type }),
    });
    return response.json();
  } catch (error) {
    console.error("Error fetching meeting token:", error);
    return false;
  }
}

export async function createReport({
  appointmentId,
  data,
}: {
  appointmentId: number;
  data: Omit<Appointment["report"], "date">;
}) {
  try {
    const response = await fetch(`${API}/report`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId,
        ...data,
      }),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating report:", error);
    return false;
  }
}

export async function updateReport({
  appointmentId,
  data,
}: {
  appointmentId: number;
  data: Omit<Appointment["report"], "date">;
}) {
  try {
    const response = await fetch(`${API}/report`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId,
        ...data,
      }),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating report:", error);
    return false;
  }
}



/**
 *  condition      String
    doctorId       Int
    patientId      Int
    date           DateTime
    status         AppointmentStatus @default(SCHEDULED)
    isPaid         Boolean           @default(false)
    isPaidToDoctor Boolean           @default(false)

    doctor  Doctor  @relation(fields: [doctorId], references: [id], onDelete: Restrict)
    patient Patient @relation(fields: [patientId], references: [id], onDelete: Restrict)  
 */
