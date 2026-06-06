import DashboardPage from "@/components/UserComponents/user-dashboard/DashboardPage";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";
import { getCookie } from "@/utils/cookie";
import { validateToken } from "@/utils/requests/auth/jwt";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const cookieToken = await getCookie(PATIENT_TOKEN_KEY);
  const UserData = cookieToken ? await validateToken(cookieToken) : null;
  if (!UserData || !UserData.payload) {
    redirect("/");
  }
  const UserId = UserData.payload.userId;
  return <DashboardPage userId={UserId} />;
}
