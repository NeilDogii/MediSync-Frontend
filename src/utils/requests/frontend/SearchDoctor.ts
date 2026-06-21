"use server";

import { Doctor } from "@/@types/doctor";
import { fetchDoctors } from "../data/doctor";
import { predictFromModel } from "@/lib/mlPredict";

export async function getDoctorRecommendation({
  symptoms,
}: {
  symptoms: string;
}): Promise<{
  recommendedSpecialty: string;
  recommendedDoctors: Partial<Doctor>[];
}> {
  // const response = await fetch(`${API}/ai/medical-advice`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   cache: "no-store",
  //   body: JSON.stringify({ symptoms })
  // });

  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.message || "Failed to fetch doctors.");
  // }

  // const data = await response.json();
  // return data;

  const doctors = await fetchDoctors();
  const modelResponse = await predictFromModel(symptoms);
  const speciality = modelResponse.doctor;
  const data = {
    recommendedSpecialty: speciality,
    recommendedDoctors: doctors.filter(
      (doctor) => String(doctor.specialization) === speciality,
    ),
  };
  return data;
}
