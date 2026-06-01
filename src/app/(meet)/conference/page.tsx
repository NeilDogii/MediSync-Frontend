import MeetComponent from "@/components/Meet/MeetComponent";
import { validateToken } from "@/utils/requests/auth/jwt";
import React from "react";

export default async function page({
  searchParams,
}: {
  param: Promise<{ token: string }>;
  searchParams: { [key: string]: string | undefined };
}) {
  const searchParam = await searchParams;
  if (!searchParam || !searchParam.token) {
    console.error("Invalid or missing token");
    return <div>Invalid or missing token</div>;
  }
  const token = searchParam.token;

  const response = (await validateToken(token)) as unknown as {
    payload: {
      type: "doctor" | "patient";
      appointmentId: number;
      doctor: { id: number; name: string };
      patient: { id: number; name: string };
    };
  };
  if (!response || !response.payload) {
    console.error("Token validation failed");
    return <div>Token validation failed</div>;
  }

  return <MeetComponent data={response.payload} />;
}
