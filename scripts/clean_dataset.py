import pandas as pd

INPUT_FILE = "public/data/raw_data.csv"
OUTPUT_FILE = "public/data/clean_dataset.csv"

print("Loading dataset...")
df = pd.read_csv(INPUT_FILE)
print("Loaded:", df.shape)

# Define your target label directly using the exact column name from your raw schema
TARGET_COL = "diseases"

# Isolate symptom columns by explicitly excluding the target index name
symptom_cols = [c for c in df.columns if c != TARGET_COL]

def build_symptoms(row):
    symptoms = []
    for col in symptom_cols:
        # Explicitly check for integer or float occurrences of 1
        if row[col] == 1 or str(row[col]).strip() == "1":
            # Extract the actual column name string as the symptom
            clean_symptom = str(col).replace("_", " ").strip()
            symptoms.append(clean_symptom)
    return " ".join(symptoms)

print("Converting symptom columns → clean text phrases...")
df["symptoms"] = df.apply(build_symptoms, axis=1)

# Format targets and clear whitespace
df["symptoms"] = df["symptoms"].astype(str).str.lower().str.replace(r"\s+", " ", regex=True).str.strip()
df["disease"] = df[TARGET_COL].astype(str).str.lower().str.strip()

# Auto Doctor Mapping rules
SPECIALTY_RULES = {
    "CARDIOLOGY": ["heart", "angina", "cardiac", "hypertension", "myocardial", "arrhythmia", "coronary"],
    "DERMATOLOGY": ["skin", "eczema", "psoriasis", "rash", "acne", "dermatitis", "wart"],
    "NEUROLOGY": ["migraine", "epilepsy", "brain", "stroke", "headache", "seizure", "parkinson", "neuropathy"],
    "PEDIATRICS": ["infant", "child", "newborn", "baby"],
    "RADIOLOGY": ["fracture", "mass", "tumor", "lesion"],
    "ONCOLOGY": ["cancer", "carcinoma", "tumor", "lymphoma", "leukemia"],
    "ORTHOPEDICS": ["joint", "bone", "arthritis", "back", "hip", "knee", "spine", "fracture", "disc"],
    "GYNECOLOGY": ["ovary", "uterus", "pregnancy", "vaginal", "menstrual", "pcos", "endometriosis", "breast"],
    "PSYCHIATRY": ["panic", "depression", "anxiety", "mental", "psychotic", "bipolar", "schizo", "personality"]
}

def map_doctor(disease_str):
    for doctor, keywords in SPECIALTY_RULES.items():
        if any(word in disease_str for word in keywords):
            return doctor
    return "GENERAL_MEDICINE"

print("Assigning doctor specialties...")
df["doctor_type"] = df["disease"].apply(map_doctor)

# Filter empty strings and drop exact duplicate records
df = df[df["symptoms"].str.len() > 0]
df = df.drop_duplicates(subset=["symptoms", "disease"])

# Export clean target configuration
clean_df = df[["symptoms", "disease", "doctor_type"]]
clean_df.to_csv(OUTPUT_FILE, index=False)

print(f"\nSaved successfully to {OUTPUT_FILE}")
print(clean_df.head(3))