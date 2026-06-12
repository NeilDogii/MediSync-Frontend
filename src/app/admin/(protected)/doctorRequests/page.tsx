import React from "react";
import AdminDoctorRequestsPage from "@/components/AdminComponents/AdminDoctorRequestsPage";
import { fetchDoctorRequests } from "@/utils/requests/admin/doctor";
export default async function Page() {
  const requests = await fetchDoctorRequests();

  return <AdminDoctorRequestsPage data={requests} />;
}
