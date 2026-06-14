import DoctorsListPage from "@/components/UserComponents/doctors/DoctorsListPage";
import { fetchDoctors } from "@/utils/requests/data/doctor";
import React from "react";

export default async function page() {
  const doctors = await fetchDoctors();
  return <DoctorsListPage doctors={doctors} />;
}
