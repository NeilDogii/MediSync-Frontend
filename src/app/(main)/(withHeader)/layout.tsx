import Navbar from "@/components/UserComponents/Navbar";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";
import { getCookie } from "@/utils/cookie";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getCookie(PATIENT_TOKEN_KEY);

  return (
    <main>
      <Navbar isLoggedIn={!!token} />
      {children}
    </main>
  );
}
