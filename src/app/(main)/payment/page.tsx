import PaymentClient from "@/components/UserComponents/PaymentClient";
import { getCookie } from "@/utils/cookie";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";
import { redirect } from "next/navigation";

export default async function PaymentPage() {
  const token = await getCookie(PATIENT_TOKEN_KEY);

  if (!token) {
    redirect("/recommendations");
  }

  return <PaymentClient token={token} />;
}
