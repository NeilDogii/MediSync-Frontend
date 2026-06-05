"use server";

import { Doctor } from "@/@types/doctor";
import { API } from "@/constants/environment/variables";

export async function getDoctorRecommendation({symptoms}: {symptoms: string}): Promise<{
    advice: string;
    recommendedSpecialty: string;
    recommendedDoctors: Partial<Doctor>[];
}> {
  const response = await fetch(`${API}/ai/medical-advice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ symptoms })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch doctors.");
  }

  const data = await response.json();
  return data;
}