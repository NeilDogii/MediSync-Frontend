import DoctorReports from "@/components/DoctorComponents/DoctorReports";
import { DOCTOR_TOKEN_KEY } from "@/constants/keys";
import { getCookie } from "@/utils/cookie";
import { validateToken } from "@/utils/requests/auth/jwt";
import { fetchDoctorReports } from "@/utils/requests/misc/doctor";
import React from "react";

export default async function page() {
  const doctorToken = await getCookie(DOCTOR_TOKEN_KEY);
  const doctorDetails = await validateToken(doctorToken || "");
  const doctorId = doctorDetails?.payload?.userId;

  let doctorReports = null;
  if (doctorId) {
    try {
      doctorReports = await fetchDoctorReports(parseInt(doctorId));
    } catch (error) {
      console.error("Failed to fetch doctor dashboard data:", error);
    }
  }
  return <DoctorReports data={doctorReports || []} />;
}
