import { NextRequest, NextResponse } from "next/server";
import { predictDiseaseAndDoctor } from "@/lib/mlPredict";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const symptoms = body.symptoms || body.text || "";

    if (!symptoms || typeof symptoms !== "string") {
      return NextResponse.json(
        { error: "Symptoms text is required" },
        { status: 400 }
      );
    }

    const result = await predictDiseaseAndDoctor(symptoms);

    return NextResponse.json({
      success: true,
      response: `Predicted disease: ${result.disease}. Recommended doctor: ${result.doctorSpecialty}. Confidence: ${result.confidence}%`,
      ...result,
    });
  } catch (error) {
    console.error("Prediction API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process prediction request",
      },
      { status: 500 }
    );
  }
}