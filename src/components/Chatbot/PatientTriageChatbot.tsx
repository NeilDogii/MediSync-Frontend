"use client";

import { useState } from "react";

type Message = {
  sender: "bot" | "user";
  text: string;
};

type PredictionResponse = {
  disease: string;
  doctor: string;
  confidence: number;
  urgent: boolean;
  matchedSymptoms: string[];
  advice: string;
  topDiseases: { label: string; probability: number }[];
};

export default function PatientTriageChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello 👋 I can help with a preliminary symptom-based triage. What is your age?",
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<"age" | "gender" | "symptoms" | "done">("age");
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const pushBot = (text: string) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setInput("");

    if (step === "age") {
      const parsedAge = Number(userInput);
      setAge(Number.isFinite(parsedAge) ? parsedAge : null);
      pushBot("Thank you. Please enter your gender.");
      setStep("gender");
      return;
    }

    if (step === "gender") {
      setGender(userInput);
      pushBot(
        "Please describe your symptoms in one sentence. Example: chest pain, sweating, shortness of breath."
      );
      setStep("symptoms");
      return;
    }

    if (step === "symptoms") {
      setLoading(true);
      try {
        const response = await fetch("/api/chatbot/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ age, gender, symptoms: userInput }),
        });

        const data = (await response.json()) as PredictionResponse | { message: string };

        if (!response.ok || !("disease" in data)) {
          throw new Error("message" in data ? data.message : "Prediction failed.");
        }

        const lines = [
          `Predicted disease: ${data.disease}`,
          `Recommended doctor: ${data.doctor}`,
          `Confidence score: ${data.confidence}%`,
          `Matched terms: ${data.matchedSymptoms.join(", ") || "not available"}`,
          `Top possibilities: ${data.topDiseases
            .map((item) => `${item.label} (${item.probability}%)`)
            .join(", ")}`,
          data.advice,
        ];

        if (data.urgent) {
          lines.unshift("⚠️ This looks urgent. Please seek immediate medical care.");
        }

        pushBot(lines.join("\n\n"));
        setStep("done");
      } catch (error) {
        pushBot(error instanceof Error ? error.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hello 👋 I can help with a preliminary symptom-based triage. What is your age?",
      },
    ]);
    setInput("");
    setStep("age");
    setAge(null);
    setGender("");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow-xl rounded-3xl border border-cyan-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0077B6] to-[#17A2B8] px-6 py-5 text-white">
          <h1 className="text-3xl font-bold">Medisync Chatbot</h1>
          <p className="text-sm mt-2 text-cyan-50">
            Uses your trained local model and dataset to predict a likely disease pattern and doctor department.
          </p>
        </div>

        <div className="h-[420px] overflow-y-auto bg-slate-50 p-5 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm shadow-sm ${
                message.sender === "bot"
                  ? "bg-white text-slate-800 border border-slate-200"
                  : "ml-auto bg-[#0077B6] text-white"
              }`}
            >
              {message.text}
            </div>
          ))}

          {loading && (
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm bg-white text-slate-800 border border-slate-200">
              Running the trained model and preparing your result...
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4 bg-white">
          {step !== "done" ? (
            <div className="flex gap-3">
              <input
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#0077B6]"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  step === "age"
                    ? "Enter age"
                    : step === "gender"
                      ? "Enter gender"
                      : "Describe symptoms"
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") void handleSend();
                }}
              />
              <button
                onClick={() => void handleSend()}
                disabled={loading}
                className="rounded-xl bg-[#0077B6] px-5 py-3 font-semibold text-white hover:bg-[#005f92] disabled:opacity-60"
              >
                Send
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                This result is preliminary and should not replace professional medical diagnosis.
              </p>
              <button
                onClick={resetChat}
                className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
              >
                Start again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
