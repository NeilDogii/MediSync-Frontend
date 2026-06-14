import AdminDashboardPage from "@/components/AdminComponents/AdminDashboardPage";
import {
  fetchDoctorsAdmin,
  fetchPatients,
  fetchReports,
} from "@/utils/requests/data/admin";
import React from "react";

export default async function page() {
  const [doctors, patients, reports] = await Promise.all([
    fetchDoctorsAdmin(),
    fetchPatients(),
    fetchReports(),
  ]);
  return (
    <AdminDashboardPage
      doctors={doctors}
      patients={patients}
      reports={reports}
    />
  );
}
