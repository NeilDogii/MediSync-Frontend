import SidebarDoctor from "@/components/DoctorComponents/SidebarDoctor";
import { DOCTOR_TOKEN_KEY } from "@/constants/keys";
import { getCookie } from "@/utils/cookie";
import { validateToken } from "@/utils/requests/auth/jwt";
import { fetchDoctor } from "@/utils/requests/misc/doctor";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MediSync - Doctor Panel",
  description: "Doctor dashboard for managing appointments and patients",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminToken = await getCookie(DOCTOR_TOKEN_KEY);
  if (!adminToken) {
    redirect("/doctor/login");
  }
  const tokenPayload = await validateToken(adminToken as string);
  if (!tokenPayload) {
    redirect("/doctor/login");
  }
  const doctorData = await fetchDoctor(parseInt(tokenPayload.payload.userId));
  if (!doctorData) {
    redirect("/doctor/login");
  }
  return (
    <main>
      <SidebarDoctor doctorData={doctorData} />
      {children}
    </main>
  );
}
