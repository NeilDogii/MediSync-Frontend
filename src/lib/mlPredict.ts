import modelData from "../../public/data/chatbot-model.json";

type Probability = { label: string; probability: number };

type ModelArtifact = {
  version: number;
  vectorizer: {
    vocabulary: string[];
    idf: number[];
    ngram_range: [number, number];
  };
  disease_model: {
    classes: string[];
    class_log_prior: number[];
    feature_log_prob: number[][];
  };
  doctor_model: {
    classes: string[];
    class_log_prior: number[];
    feature_log_prob: number[][];
  };
  meta?: {
    record_count: number;
    disease_count: number;
    doctor_count: number;
  };
};

const artifact = modelData as ModelArtifact;
const vocabIndex = new Map<string, number>();
artifact.vectorizer.vocabulary.forEach((term, idx) => vocabIndex.set(term, idx));

function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildTerms(text: string): string[] {
  const tokens = cleanText(text).split(" ").filter(Boolean);
  const terms: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    terms.push(tokens[i]);
    if (i < tokens.length - 1) {
      terms.push(`${tokens[i]} ${tokens[i + 1]}`);
    }
  }

  return terms;
}

function vectorize(text: string): number[] {
  const vec = new Array(artifact.vectorizer.vocabulary.length).fill(0);
  const counts = new Map<number, number>();

  for (const term of buildTerms(text)) {
    const idx = vocabIndex.get(term);
    if (idx !== undefined) {
      counts.set(idx, (counts.get(idx) || 0) + 1);
    }
  }

  let norm = 0;
  counts.forEach((count, idx) => {
    const tf = 1 + Math.log(count);
    const value = tf * artifact.vectorizer.idf[idx];
    vec[idx] = value;
    norm += value * value;
  });

  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < vec.length; i++) {
      vec[i] = vec[i] / norm;
    }
  }

  return vec;
}

function softmax(scores: number[]): number[] {
  const maxScore = Math.max(...scores);
  const exps = scores.map((score) => Math.exp(score - maxScore));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}

function predictNB(
  vec: number[],
  model: {
    classes: string[];
    class_log_prior: number[];
    feature_log_prob: number[][];
  }
): { label: string; confidence: number; probabilities: Probability[] } {
  const scores = model.class_log_prior.map((prior, classIdx) => {
    let score = prior;
    const featureWeights = model.feature_log_prob[classIdx];

    for (let i = 0; i < vec.length; i++) {
      if (vec[i] !== 0) {
        score += vec[i] * featureWeights[i];
      }
    }

    return score;
  });

  const probs = softmax(scores);
  const bestIdx = probs.indexOf(Math.max(...probs));

  return {
    label: model.classes[bestIdx],
    confidence: Number((probs[bestIdx] * 100).toFixed(2)),
    probabilities: model.classes.map((label, idx) => ({
      label,
      probability: Number((probs[idx] * 100).toFixed(2)),
    })),
  };
}

function detectUrgency(text: string): boolean {
  const symptomText = text.toLowerCase();
  const redFlags = [
    "chest pain",
    "shortness of breath",
    "seizure",
    "unconscious",
    "severe bleeding",
    "stroke",
    "paralysis",
    "suicidal",
  ];
  return redFlags.some((flag) => symptomText.includes(flag));
}

function extractMatchedTerms(text: string): string[] {
  return [...new Set(buildTerms(text).filter((term) => vocabIndex.has(term)))].slice(0, 8);
}

export function predictFromModel(symptoms: string) {
  const vec = vectorize(symptoms);
  const diseasePred = predictNB(vec, artifact.disease_model);
  const doctorPred = predictNB(vec, artifact.doctor_model);

  return {
    disease: diseasePred.label,
    doctor: doctorPred.label,
    confidence: diseasePred.confidence,
    urgent: detectUrgency(symptoms),
    matchedSymptoms: extractMatchedTerms(symptoms),
    topDiseases: diseasePred.probabilities.sort((a, b) => b.probability - a.probability).slice(0, 3),
  };
}
