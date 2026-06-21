import pandas as pd
import json

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

print("Loading cleaned dataset...")

df = pd.read_csv("public/data/clean_dataset.csv")
df = df.dropna()

X = df["symptoms"]

y_disease = df["disease"]
y_doctor = df["doctor_type"]

print("Vectorizing...")

vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    min_df=2,
    max_df=0.98,
)

X_vec = vectorizer.fit_transform(X)

print("Splitting data for evaluation...")
X_train, X_test, y_train_dis, y_test_dis, y_train_doc, y_test_doc = train_test_split(
    X_vec, y_disease, y_doctor, test_size=0.2, random_state=42
)


print("Training disease model...")
disease_model = MultinomialNB()

disease_model.fit(X_train, y_train_dis)


print("Training doctor model...")
doctor_model = MultinomialNB()

doctor_model.fit(X_train, y_train_doc)


print("\n--- Evaluating Disease Classification Model ---")
y_train_pred = disease_model.predict(X_train)
y_test_pred = disease_model.predict(X_test)

train_accuracy = accuracy_score(y_train_dis, y_train_pred)
test_accuracy = accuracy_score(y_test_dis, y_test_pred)

print(f"Training Accuracy: {train_accuracy * 100:.2f}%")
print(f"Validation / Test Accuracy: {test_accuracy * 100:.2f}%\n")

print("--- Detailed Classification Report ---")

report = classification_report(y_test_dis, y_test_pred, zero_division=0)
print(report)


print("\nExporting...")

artifact = {
    "version": 2,
    "vectorizer": {
        "vocabulary": vectorizer.get_feature_names_out().tolist(),
        "idf": vectorizer.idf_.tolist(),
        "ngram_range": [1, 2],
    },
    "disease_model": {
        "classes": disease_model.classes_.tolist(),
        "class_log_prior": disease_model.class_log_prior_.tolist(),
        "feature_log_prob": disease_model.feature_log_prob_.tolist(),
    },
    "doctor_model": {
        "classes": doctor_model.classes_.tolist(),
        "class_log_prior": doctor_model.class_log_prior_.tolist(),
        "feature_log_prob": doctor_model.feature_log_prob_.tolist(),
    },
    "meta": {
        "record_count": len(df),
        "disease_count": len(disease_model.classes_),
        "doctor_count": len(doctor_model.classes_),
    }
}

print()
print("Rows:", len(df))
print("Vocabulary:", len(vectorizer.vocabulary_))
print("Disease classes:", len(disease_model.classes_))
print("Doctor classes:", len(doctor_model.classes_))
print("\nSaved Successfully.")