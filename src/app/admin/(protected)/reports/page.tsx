import AdminReportsPage from "@/components/AdminComponents/AdminReportsPage";
import { fetchReports } from "@/utils/requests/data/admin";
import React from "react";

export default async function page() {
  const reports = await fetchReports();
  return <AdminReportsPage reports={reports} />;
}
