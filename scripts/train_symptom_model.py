import pandas as pd
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB


df = pd.read_csv("public/data/patient_symptoms_disease_doctor_type_10000.csv")


df = df.dropna()


X = df["symptoms"]
y_disease = df["disease"]
y_doctor = df["doctor_type"]


vectorizer = TfidfVectorizer(stop_words="english")
X_vec = vectorizer.fit_transform(X)


disease_model = MultinomialNB()
disease_model.fit(X_vec, y_disease)

doctor_model = MultinomialNB()
doctor_model.fit(X_vec, y_doctor)


model = {
    "vocabulary": vectorizer.get_feature_names_out().tolist(),
    "idf": vectorizer.idf_.tolist(),
    "disease_classes": disease_model.classes_.tolist(),
    "doctor_classes": doctor_model.classes_.tolist()
}

with open("public/data/chatbot-model.json", "w") as f:
    json.dump(model, f)

print("Model trained successfully")