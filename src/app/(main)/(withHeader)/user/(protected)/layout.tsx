import UserSidebar from "@/components/UserComponents/UserSidebar";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";
import { getCookie } from "@/utils/cookie";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MediSync - User Dashboard",
  description: "Manage your appointments and medical records",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const patientToken = await getCookie(PATIENT_TOKEN_KEY);
  if (!patientToken) {
    redirect("/");
  }
  return (
    <section className="flex gap-6 mt-36 h-[calc(100vh-144px)] overflow-hidden px-6 pb-6">
      <UserSidebar />
      <section className="flex-1 h-full overflow-y-auto no-scrollbar">
        {children}
      </section>
    </section>
  );
}
