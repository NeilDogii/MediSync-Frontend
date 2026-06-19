import DoctorsListPage from "@/components/UserComponents/doctors/DoctorsListPage";
import { fetchDoctors } from "@/utils/requests/data/doctor";
import React from "react";

export default async function page({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
  searchParams,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  searchParams: Promise<{ s: string }>;
}) {
  const doctors = await fetchDoctors();
  const searchQuery = ((await searchParams).s || "").replaceAll("_", " ");
  return <DoctorsListPage doctors={doctors} search={searchQuery} />;
}
