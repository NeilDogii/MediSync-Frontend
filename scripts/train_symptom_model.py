import pandas as pd
import json

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB


print("Loading cleaned dataset...")

df = pd.read_csv(
    "public/data/clean_dataset.csv"
)

df = df.dropna()


# INPUT
X = df["symptoms"]


# TARGETS
y_disease = df["disease"]
y_doctor = df["doctor_type"]


print("Vectorizing...")


vectorizer = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 3),
    min_df=2,
    max_df=0.98,
)

X_vec = vectorizer.fit_transform(
    X
)


print("Training disease model...")


disease_model = (
    MultinomialNB()
)

disease_model.fit(
    X_vec,
    y_disease
)


print("Training doctor model...")


doctor_model = (
    MultinomialNB()
)

doctor_model.fit(
    X_vec,
    y_doctor
)


print("Exporting...")


artifact = {

    "version": 2,

    "vectorizer": {

        "vocabulary":
        vectorizer
        .get_feature_names_out()
        .tolist(),

        "idf":
        vectorizer
        .idf_
        .tolist(),

        "ngram_range": [
            1,
            2
        ],
    },

    "disease_model": {

        "classes":
        disease_model
        .classes_
        .tolist(),

        "class_log_prior":
        disease_model
        .class_log_prior_
        .tolist(),

        "feature_log_prob":
        disease_model
        .feature_log_prob_
        .tolist(),
    },

    "doctor_model": {

        "classes":
        doctor_model
        .classes_
        .tolist(),

        "class_log_prior":
        doctor_model
        .class_log_prior_
        .tolist(),

        "feature_log_prob":
        doctor_model
        .feature_log_prob_
        .tolist(),
    },

    "meta": {

        "record_count":
        len(df),

        "disease_count":
        len(
            disease_model.classes_
        ),

        "doctor_count":
        len(
            doctor_model.classes_
        ),
    }
}


with open(
    "public/data/chatbot-model.json",
    "w"
) as f:

    json.dump(
        artifact,
        f
    )


print()

print(
    "Rows:",
    len(df)
)

print(
    "Vocabulary:",
    len(
        vectorizer.vocabulary_
    )
)

print(
    "Disease classes:",
    len(
        disease_model.classes_
    )
)

print(
    "Doctor classes:",
    len(
        doctor_model.classes_
    )
)

print()

print(
    "Saved"
)