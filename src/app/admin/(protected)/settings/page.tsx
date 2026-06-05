import AdminSettingsPage from "@/components/AdminComponents/AdminSettingsPage";
import { ADMIN_TOKEN_KEY } from "@/constants/keys";
import { getCookie } from "@/utils/cookie";
import { validateToken } from "@/utils/requests/auth/jwt";
import { fetchAdmin } from "@/utils/requests/data/admin";
import React from "react";

export default async function page() {
  const adminToken = await getCookie(ADMIN_TOKEN_KEY);
  const adminDetails = await validateToken(adminToken || "");
  const adminId = adminDetails?.payload?.userId;
  let adminData = null;

  if (adminId) {
    try {
      adminData = await fetchAdmin(adminId);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    }
  }

  return <AdminSettingsPage adminId={adminId} data={adminData} />;
}
