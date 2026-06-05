import DoctorDashboard from "../../../../components/DoctorComponents/DoctorDashboard";
import { DOCTOR_TOKEN_KEY } from "@/constants/keys";
import { getCookie } from "@/utils/cookie";
import { validateToken } from "@/utils/requests/auth/jwt";
import { fetchDoctorDashboard } from "@/utils/requests/misc/doctor";

export default async function DashboardPage() {
  const doctorToken = await getCookie(DOCTOR_TOKEN_KEY);
  const doctorDetails = await validateToken(doctorToken || "");
  const doctorId = doctorDetails?.payload?.userId;

  let dashboardData = null;
  if (doctorId) {
    try {
      dashboardData = await fetchDoctorDashboard(parseInt(doctorId));
      console.log(dashboardData);
    } catch (error) {
      console.error("Failed to fetch doctor dashboard data:", error);
    }
  }

  return (
    <div className="min-h-screen">
      <DoctorDashboard dashboardData={dashboardData} />
    </div>
  );
}
