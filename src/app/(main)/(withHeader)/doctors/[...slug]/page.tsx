import DoctorProfilePage from "@/components/UserComponents/doctors/DoctorProfilePage";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";
import { getCookie } from "@/utils/cookie";
import { validateToken } from "@/utils/requests/auth/jwt";
import { fetchDoctor } from "@/utils/requests/misc/doctor";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const token = await getCookie(PATIENT_TOKEN_KEY);
  let userData = null;
  if (!slug || slug.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">
          Invalid Doctor Profile URL
        </h1>
      </div>
    );
  }
  const id = slug[0];
  if (isNaN(Number(id))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">
          Invalid Doctor ID: {id}
        </h1>
      </div>
    );
  }

  if (token) {
    try {
      const userResponse = await validateToken(token);
      if (userResponse) {
        userData = {
          id: userResponse.payload.userId,
          name: userResponse.payload?.name || "Anonymous User",
        };
      }
    } catch (error) {
      console.error("Error validating token:", error);
    }
  }
  const doctorData = await fetchDoctor(Number(id));
  return <DoctorProfilePage doctorData={doctorData} userData={userData} />;
}
