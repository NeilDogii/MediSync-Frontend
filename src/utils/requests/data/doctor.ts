import { Doctor } from "@/@types/doctor";
import { API } from "@/constants/environment/variables";

export async function fetchDoctors(): Promise<Doctor[]> {
  const response = await fetch(`${API}/doctor`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["cache", "doctors"], revalidate: 60 * 5 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch doctors.");
  }

  const data = await response.json();
  return data;
}
