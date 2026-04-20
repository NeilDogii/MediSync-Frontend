import { NextRequest, NextResponse } from "next/server";
import { predictFromModel } from "@/lib/mlPredict";

function buildAdvice(doctor: string, urgent: boolean): string {
  if (urgent) {
    return "These symptoms may require urgent medical attention. Please seek emergency care immediately.";
  }

  if (["CARDIOLOGY", "NEUROLOGY", "ONCOLOGY"].includes(doctor)) {
    return "This is a preliminary symptom-based prediction. Please consult the recommended specialist as soon as possible.";
  }

  return "This is a preliminary symptom-based prediction based on your dataset. Please consult the recommended doctor for proper diagnosis.";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const symptoms = String(body.symptoms || "").trim();

    if (!symptoms) {
      return NextResponse.json({ message: "Symptoms are required." }, { status: 400 });
    }

    const prediction = predictFromModel(symptoms);

    return NextResponse.json({
      disease: prediction.disease,
      doctor: prediction.doctor,
      confidence: prediction.confidence,
      urgent: prediction.urgent,
      matchedSymptoms: prediction.matchedSymptoms,
      topDiseases: prediction.topDiseases,
      advice: buildAdvice(prediction.doctor, prediction.urgent),
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Prediction failed." },
      { status: 500 }
    );
  }
}
