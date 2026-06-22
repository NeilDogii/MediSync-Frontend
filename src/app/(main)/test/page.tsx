// import { fetchMeetingToken } from "@/utils/requests/appointment/appointments";
// import Link from "next/link";
// import React from "react";

// export default async function page() {
//   const { token } = await fetchMeetingToken({
//     appointmentId: 1,
//     type: "patient",
//   });
//   return <Link href={`/conference?token=${token}`}>Go to Appointments</Link>;
// }
import { fetchMeetingToken } from "@/utils/requests/appointment/appointments";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { token } = await fetchMeetingToken({
    appointmentId: 1,
    type: "patient",
  });

  return <Link href={`/conference?token=${token}`}>Go to Appointments</Link>;
}
