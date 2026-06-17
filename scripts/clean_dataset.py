import pandas as pd


# =====================================
# FILE PATHS
# =====================================

INPUT_FILE = "public/data/raw_data.csv"
OUTPUT_FILE = "public/data/clean_dataset.csv"


# =====================================
# LOAD
# =====================================

print("Loading dataset...")

df = pd.read_csv(INPUT_FILE)

print("Loaded:", df.shape)


# =====================================
# RENAME TARGET
# =====================================

df = df.rename(
    columns={
        "diseases": "disease"
    }
)


# =====================================
# SYMPTOM COLUMNS
# =====================================

symptom_cols = [
    c
    for c in df.columns
    if c != "disease"
]


# =====================================
# BUILD TEXT FROM ACTIVE SYMPTOMS
# =====================================

def build_symptoms(row):

    symptoms = []

    for col in symptom_cols:

        value = row[col]

        if value == 1:

            symptoms.append(
                col
                .replace("_", " ")
                .strip()
            )

    return " ".join(symptoms)


print("Converting symptom columns → text...")

df["symptoms"] = (
    df
    .apply(
        build_symptoms,
        axis=1
    )
)


# =====================================
# CLEAN TEXT
# =====================================

df["symptoms"] = (
    df["symptoms"]
    .astype(str)
    .str.lower()
    .str.replace(
        r"\s+",
        " ",
        regex=True
    )
    .str.strip()
)

df["disease"] = (
    df["disease"]
    .astype(str)
    .str.lower()
    .str.strip()
)


# =====================================
# AUTO DOCTOR MAPPING
# =====================================

SPECIALTY_RULES = {

    "CARDIOLOGY": [
        "heart",
        "angina",
        "cardiac",
        "hypertension",
        "myocardial",
        "arrhythmia",
        "coronary",
    ],

    "DERMATOLOGY": [
        "skin",
        "eczema",
        "psoriasis",
        "rash",
        "acne",
        "dermatitis",
        "wart",
    ],

    "NEUROLOGY": [
        "migraine",
        "epilepsy",
        "brain",
        "stroke",
        "headache",
        "seizure",
        "parkinson",
        "neuropathy",
    ],

    "PEDIATRICS": [
        "infant",
        "child",
        "newborn",
        "baby",
    ],

    "RADIOLOGY": [
        "fracture",
        "mass",
        "tumor",
        "lesion",
    ],

    "ONCOLOGY": [
        "cancer",
        "carcinoma",
        "tumor",
        "lymphoma",
        "leukemia",
    ],

    "ORTHOPEDICS": [
        "joint",
        "bone",
        "arthritis",
        "back",
        "hip",
        "knee",
        "spine",
        "fracture",
        "disc",
    ],

    "GYNECOLOGY": [
        "ovary",
        "uterus",
        "pregnancy",
        "vaginal",
        "menstrual",
        "pcos",
        "endometriosis",
        "breast",
    ],

    "PSYCHIATRY": [
        "panic",
        "depression",
        "anxiety",
        "mental",
        "psychotic",
        "bipolar",
        "schizo",
        "personality",
    ],
}


def map_doctor(disease):

    disease = str(
        disease
    ).lower()

    for doctor, keywords in SPECIALTY_RULES.items():

        if any(
            word in disease
            for word in keywords
        ):
            return doctor

    return "GENERAL_MEDICINE"


print("Assigning doctor specialties...")

df["doctor_type"] = (
    df["disease"]
    .apply(
        map_doctor
    )
)


# =====================================
# REMOVE EMPTY
# =====================================

df = (
    df[
        df["symptoms"]
        .str.len()
        > 0
    ]
)


# =====================================
# REMOVE DUPLICATES
# =====================================

df = (
    df
    .drop_duplicates(
        subset=[
            "symptoms",
            "disease"
        ]
    )
)


# =====================================
# FINAL DATASET
# =====================================

clean_df = (
    df[
        [
            "symptoms",
            "disease",
            "doctor_type"
        ]
    ]
)


# =====================================
# SAVE
# =====================================

clean_df.to_csv(
    OUTPUT_FILE,
    index=False
)


# =====================================
# REPORT
# =====================================

print()
print("Saved:", OUTPUT_FILE)

print()

print(
    "Rows:",
    len(clean_df)
)

print(
    "Unique symptoms:",
    clean_df["symptoms"]
    .nunique()
)

print(
    "Diseases:",
    clean_df["disease"]
    .nunique()
)

print(
    "Doctors:",
    clean_df["doctor_type"]
    .nunique()
)

print()

print(
    clean_df
    .head()
)

print()

fallback = (
    clean_df[
        clean_df[
            "doctor_type"
        ]
        ==
        "GENERAL_MEDICINE"
    ]
    ["disease"]
    .unique()
)

print(
    "Fallback diseases:"
)

print(
    len(
        fallback
    )
)

print(
    fallback[:50]
)