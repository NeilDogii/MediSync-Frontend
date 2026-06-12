import fs from "fs";
import path from "path";

export type ChatbotProfile = {
  disease: string;
  doctor_type: string;
  age_mean: number;
  gender_mode: string;
  symptom_phrases: string[];
  keywords: string[];
};

export type ChatbotModel = {
  version: number;
  record_count: number;
  profiles: ChatbotProfile[];
};

let cachedModel: ChatbotModel | null = null;

const EMERGENCY_PHRASES = [
  "chest pain",
  "shortness of breath",
  "seizure",
  "unconscious",
  "severe bleeding",
  "stroke",
  "fainting",
  "suicidal",
];

export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function getChatbotModel(): ChatbotModel {
  if (cachedModel) return cachedModel;

  const filePath = path.join(process.cwd(), "public", "data", "chatbot-model.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedModel = JSON.parse(raw) as ChatbotModel;
  return cachedModel;
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((token) => token.length > 2);
}

export function inferUrgency(symptoms: string): boolean {
  const normalized = normalizeText(symptoms);
  return EMERGENCY_PHRASES.some((phrase) => normalized.includes(phrase));
}

export function predictFromSymptoms(params: {
  age?: number | null;
  gender?: string | null;
  symptoms: string;
}) {
  const model = getChatbotModel();
  const normalizedSymptoms = normalizeText(params.symptoms);
  const tokens = tokenize(params.symptoms);

  let bestProfile = model.profiles[0];
  let bestScore = -Infinity;

  for (const profile of model.profiles) {
    let score = 0;

    for (const phrase of profile.symptom_phrases) {
      if (normalizedSymptoms.includes(normalizeText(phrase))) score += 3;
    }

    for (const keyword of profile.keywords) {
      if (tokens.includes(keyword)) score += 1;
    }

    if (typeof params.age === "number") {
      const diff = Math.abs(params.age - profile.age_mean);
      if (diff <= 5) score += 0.8;
      else if (diff <= 10) score += 0.4;
    }

    if (params.gender && profile.gender_mode.toLowerCase() === params.gender.toLowerCase()) {
      score += 0.2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestProfile = profile;
    }
  }

  const urgency = inferUrgency(params.symptoms);
  const confidence = Math.max(35, Math.min(96, Math.round(45 + bestScore * 6)));

  return {
    disease: bestProfile.disease,
    doctorType: bestProfile.doctor_type,
    confidence,
    urgency,
    matchedSymptoms: bestProfile.symptom_phrases.slice(0, 4),
  };
}

export function buildAdvice(disease: string, doctorType: string, urgency: boolean): string {
  if (urgency) {
    return `The symptoms you entered resemble patterns that should be checked urgently. Based on the dataset, ${disease} is a possible match and ${doctorType} is the most relevant department. Please seek immediate medical attention.`;
  }

  return `Based on the symptom patterns in the local dataset, ${disease} is the closest match. The suggested department is ${doctorType}. This is only a preliminary triage result and should be confirmed by a licensed doctor.`;
}

export function buildRecommendedDoctors(doctorType: string) {
  return [
    { name: "A. Sen", specialization: doctorType, fees: 500 },
    { name: "R. Gupta", specialization: doctorType, fees: 650 },
    { name: "N. Das", specialization: doctorType, fees: 700 },
  ];
}
