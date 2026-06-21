import modelData from "../../public/data/chatbot-model.json";

type ModelArtifact = {
  version: number;
  vectorizer: {
    vocabulary: string[];
  };
  disease_model: {
    classes: string[];
    class_log_prior: number[];
    feature_log_prob: number[][];
  };
};

const artifact = modelData as ModelArtifact;

const vocabMap = new Map<string, number>();
artifact.vectorizer.vocabulary.forEach((term, idx) => {
  vocabMap.set(term, idx);
});

const SPECIALTY_RULES: Record<string, string[]> = {
  CARDIOLOGY: [
    "heart",
    "angina",
    "cardiac",
    "hypertension",
    "arrhythmia",
    "coronary",
  ],
  DERMATOLOGY: ["skin", "eczema", "psoriasis", "rash", "acne", "dermatitis"],
  NEUROLOGY: [
    "migraine",
    "epilepsy",
    "brain",
    "stroke",
    "headache",
    "seizure",
    "meningitis",
  ],
  PSYCHIATRY: [
    "panic",
    "depression",
    "anxiety",
    "mental",
    "bipolar",
    "schizo",
    "nervousness",
  ],
  GENERAL_MEDICINE: [
    "cold",
    "influenza",
    "pneumonia",
    "bronchitis",
    "fever",
    "appendicitis",
    "throat",
  ],
};

const SYNONYM_MAP: Record<string, string> = {
  "stomach ache": "abdominal pain",
  "tummy ache": "abdominal pain",
  "stomach hurts": "abdominal pain",
  "throwing up": "vomiting",
  puking: "vomiting",
  peeing: "frequent urination",
  "out of breath": "shortness of breath",
  "can't breathe": "shortness of breath",
  "heart racing": "palpitations",
  spinning: "dizziness",
  lightheaded: "dizziness",
  "feeling hot": "fever",
  "runny nose": "continuous sneezing",
};

function extractFeatures(text: string): string[] {
  const rawWords = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const strictStopWords = new Set([
    "and",
    "with",
    "or",
    "the",
    "a",
    "an",
    "of",
    "to",
    "i",
    "am",
    "in",
    "for",
    "bad",
    "having",
    "along",
    "because",
    "my",
    "right",
    "feels",
    "completely",
    "very",
    "badly",
    "when",
    "try",
    "over",
    "past",
    "few",
    "weeks",
    "today",
    "bit",
    "just",
    "kinda",
    "some",
    "alongside",
  ]);

  const cleanWords = rawWords.filter((w) => !strictStopWords.has(w));
  const features: string[] = [];

  // Generate Unigrams
  cleanWords.forEach((w) => features.push(w));

  // Generate Bigrams
  for (let i = 0; i < cleanWords.length - 1; i++) {
    features.push(`${cleanWords[i]} ${cleanWords[i + 1]}`);
  }

  // Generate Trigrams
  for (let i = 0; i < cleanWords.length - 2; i++) {
    features.push(`${cleanWords[i]} ${cleanWords[i + 1]} ${cleanWords[i + 2]}`);
  }

  return features;
}

export function predictFromModel(symptoms: string) {
  let cleanInput = symptoms.toLowerCase();

  for (const [layman, clinical] of Object.entries(SYNONYM_MAP)) {
    if (cleanInput.includes(layman)) {
      cleanInput = cleanInput.replace(new RegExp(layman, "g"), clinical);
    }
  }

  const features = extractFeatures(cleanInput);

  const vec = new Array(artifact.vectorizer.vocabulary.length).fill(0);
  const matchedTerms = new Set<string>();
  let hasMatch = false;

  features.forEach((feature) => {
    const idx = vocabMap.get(feature);
    if (idx !== undefined) {
      vec[idx] += 1;
      matchedTerms.add(feature);
      hasMatch = true;
    }
  });

  if (!hasMatch) {
    return {
      disease: "undetermined condition",
      doctor: "GENERAL_MEDICINE",
      confidence: 25.0,
      urgent: false,
      matchedSymptoms: [],
      topDiseases: [{ label: "undetermined condition", probability: 25.0 }],
      advice:
        "Please describe your symptoms in more detail for a clear triage recommendation.",
    };
  }

  const classes = artifact.disease_model.classes;
  const priors = artifact.disease_model.class_log_prior;
  const featureLogProbs = artifact.disease_model.feature_log_prob;

  const logLikelihoods = classes.map((_, classIdx) => {
    let score = priors[classIdx];

    for (let i = 0; i < vec.length; i++) {
      if (vec[i] > 0) {
        score += vec[i] * featureLogProbs[classIdx][i];
      }
    }
    return score;
  });

  const TEMPERATURE = 0.35;
  const maxLog = Math.max(...logLikelihoods);

  // Soften extreme log-likelihood leads using the temperature parameter
  const exponents = logLikelihoods.map((score) =>
    Math.exp((score - maxLog) / TEMPERATURE),
  );
  const totalSum = exponents.reduce((a, b) => a + b, 0);

  // Normalize into a strict 0-100 percentage range
  const probabilities = exponents.map((exp) =>
    totalSum > 0 ? exp / totalSum : 0,
  );

  const results = classes
    .map((className, idx) => ({
      disease: className,
      probability: probabilities[idx],
    }))
    .sort((a, b) => b.probability - a.probability);

  const topMatch = results[0];
  const calculatedConfidence = Number((topMatch.probability * 100).toFixed(2));
  const matchedTermsArray = Array.from(matchedTerms);

  if (calculatedConfidence < 40.0) {
    return {
      disease: "undetermined condition",
      doctor: "GENERAL_MEDICINE",
      confidence: calculatedConfidence,
      urgent: false,
      matchedSymptoms: matchedTermsArray,
      topDiseases: results.slice(0, 3).map((r) => ({
        label: r.disease,
        probability: Number((r.probability * 100).toFixed(1)),
      })),
      advice:
        "Please describe your symptoms in more detail for a clear triage recommendation.",
    };
  }

  const predictedDisease = topMatch.disease.toLowerCase();
  let recommendedDoctor = "GENERAL_MEDICINE";

  for (const [specialty, keywords] of Object.entries(SPECIALTY_RULES)) {
    if (
      keywords.some(
        (word) =>
          predictedDisease.includes(word) || matchedTermsArray.includes(word),
      )
    ) {
      recommendedDoctor = specialty;
      break;
    }
  }

  const textLower = symptoms.toLowerCase();
  const isUrgent =
    textLower.includes("chest pain") ||
    textLower.includes("stiff neck") ||
    predictedDisease.includes("meningitis") ||
    predictedDisease.includes("appendicitis");

  return {
    disease: topMatch.disease,
    doctor: recommendedDoctor,
    confidence: calculatedConfidence,
    urgent: isUrgent,
    matchedSymptoms: matchedTermsArray,
    topDiseases: results.slice(0, 5).map((r) => ({
      label: r.disease,
      probability: Number((r.probability * 100).toFixed(2)),
    })),
    advice: isUrgent
      ? "⚠️ Emergency Warning: These symptoms require immediate medical attention."
      : "Please consult with a healthcare professional regarding these symptoms.",
  };
}
