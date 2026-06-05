import AdminContactRequestPage from "@/components/AdminComponents/AdminContactRequestPage";
import { fetchContactRequests } from "@/utils/requests/misc/contact";
import React from "react";

export default async function page() {
  const contactRequests = await fetchContactRequests();
  return <AdminContactRequestPage data={contactRequests} />;
}
