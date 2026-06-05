import SidebarAdmin from "@/components/AdminComponents/SidebarAdmin";
import { ADMIN_TOKEN_KEY } from "@/constants/keys";
import { getCookie } from "@/utils/cookie";
import { validateToken } from "@/utils/requests/auth/jwt";
import { fetchAdmin } from "@/utils/requests/data/admin";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MediSync - Admin Panel",
  description: "Admin dashboard for managing doctors and patients",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminToken = await getCookie(ADMIN_TOKEN_KEY);
  if (!adminToken) {
    redirect("/admin/login");
  }
  const tokenPayload = await validateToken(adminToken as string);
  if (!tokenPayload) {
    redirect("/admin/login");
  }
  const adminData = await fetchAdmin(parseInt(tokenPayload.payload.userId));
  if (!adminData || !adminData.id) {
    redirect("/admin/login");
  }
  return (
    <main>
      <SidebarAdmin adminData={adminData} />
      {children}
    </main>
  );
}
