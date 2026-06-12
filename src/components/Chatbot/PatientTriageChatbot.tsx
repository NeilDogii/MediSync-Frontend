"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Send,
  Phone,
  ArrowRight,
  AlertTriangle,
  UserRound,
  Bot,
  RotateCcw,
  Stethoscope,
  ExternalLink,
} from "lucide-react";

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
  const [step, setStep] = useState<"age" | "gender" | "symptoms" | "done">(
    "age",
  );
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
        "Please describe your symptoms in one sentence. Example: chest pain, sweating, shortness of breath.",
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

        const data = (await response.json()) as
          | PredictionResponse
          | { message: string };

        if (!response.ok || !("disease" in data)) {
          throw new Error(
            "message" in data ? data.message : "Prediction failed.",
          );
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
          lines.unshift(
            "⚠️ This looks urgent. Please seek immediate medical care.",
          );
        }

        pushBot(lines.join("\n\n"));
        setStep("done");
      } catch (error) {
        pushBot(
          error instanceof Error ? error.message : "Something went wrong.",
        );
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
    <div className="bg-gradient-to-br pt-28 from-cyan-50 via-white to-blue-100">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-200px] top-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-[-100px] bottom-[-150px] h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] p-4 lg:p-6">
        {/* HEADER */}

        {/* <header className="mb-5 rounded-[32px] bg-gradient-to-r from-[#0077B6] to-[#17A2B8] p-6 text-white shadow-2xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="rounded-3xl bg-white/20 p-4">
                <HeartPulse size={34} />
              </div>

              <div>
                <h1 className="text-4xl font-bold">Medibot</h1>

                <p className="mt-2 max-w-xl text-cyan-50">
                  AI-assisted symptom screening powered by your local model.
                  Early guidance, not medical diagnosis.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/15 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck />
                <span className="text-sm">Private • Local inference</span>
              </div>
            </div>
          </div>
        </header> */}

        {/* MAIN GRID */}

        <div className="flex flex-col-reverse sm:grid gap-5 lg:grid-cols-[330px_1fr_320px]">
          {/* LEFT SIDEBAR */}

          <div className="space-y-5">
            {/* Proper Diagnosis */}

            <div className="rounded-[30px] bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-100 p-3">
                  <Stethoscope className="text-[#0077B6]" />
                </div>

                <div>
                  <h3 className="font-semibold">Get a Proper Diagnosis</h3>

                  <p className="text-xs text-slate-500">
                    Consult professionals if symptoms persist
                  </p>
                </div>
              </div>

              <button className="w-full rounded-2xl bg-[#0077B6] px-5 py-4 text-white hover:bg-[#005f92]">
                Find Nearby Doctors
              </button>
            </div>

            {/* Contact */}

            <div className="rounded-[30px] bg-white p-6 shadow-xl">
              <h3 className="mb-4 font-semibold">Need Support?</h3>

              <div className="space-y-3">
                <button className="flex w-full items-center justify-between rounded-2xl border p-4 hover:bg-slate-50">
                  <div className="flex gap-3">
                    <Phone />

                    <div>
                      <p>Contact Us</p>

                      <p className="text-xs text-slate-500">
                        Medical assistance team
                      </p>
                    </div>
                  </div>

                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Infection Feed */}

            <div className="rounded-[30px] bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center gap-2">
                <AlertTriangle className="text-red-500" />

                <h3 className="font-semibold">Health Updates</h3>
              </div>

              <div className="space-y-3">
                <Link
                  href="https://www.who.int"
                  target="_blank"
                  className="block rounded-2xl border p-4 hover:bg-cyan-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Ebola Outbreak</p>

                      <p className="mt-1 text-xs text-slate-500">
                        Current guidance →
                      </p>
                    </div>

                    <ExternalLink size={15} />
                  </div>
                </Link>

                <Link
                  href="https://www.cdc.gov/hantavirus/about/index.html"
                  target="_blank"
                  className="block rounded-2xl border p-4 hover:bg-cyan-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Hanta Virus</p>

                      <p className="mt-1 text-xs text-slate-500">
                        Read updates →
                      </p>
                    </div>

                    <ExternalLink size={15} />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* CHAT */}

          <div className="rounded-[34px] bg-white shadow-2xl overflow-hidden">
            <div className="border-b px-6 py-5">
              <h2 className="font-semibold">Medical Assistant</h2>
            </div>

            <div className="h-[65vh] overflow-auto p-6">
              <div className="space-y-5">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[80%] gap-3 ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="rounded-full p-2 bg-slate-100 h-fit">
                        {message.sender === "user" ? (
                          <UserRound size={18} />
                        ) : (
                          <Bot size={18} />
                        )}
                      </div>

                      <div
                        className={`rounded-3xl px-5 py-4 ${
                          message.sender === "user"
                            ? "bg-[#0077B6] text-white"
                            : "bg-slate-100"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-5">
              {step !== "done" ? (
                <div className="flex gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void handleSend();
                      }
                    }}
                    placeholder="Describe symptoms..."
                    className="flex-1 rounded-2xl border px-5 py-4"
                  />

                  <button
                    onClick={() => void handleSend()}
                    className="rounded-2xl bg-[#0077B6] px-6 text-white"
                  >
                    <Send />
                  </button>
                </div>
              ) : (
                <button
                  onClick={resetChat}
                  className="flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-white"
                >
                  <RotateCcw size={18} />
                  Start Again
                </button>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}

          <div className="space-y-5">
            <div className="rounded-[30px] bg-white p-6 shadow-xl">
              <h3 className="font-semibold">Before You Begin</h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Enter symptoms naturally</li>
                <li>• Include duration</li>
                <li>• Mention severity</li>
                <li>• Emergency → seek urgent care</li>
              </ul>
            </div>

            <div className="rounded-[30px] bg-gradient-to-br from-[#0077B6] to-[#17A2B8] p-6 text-white">
              <h3 className="font-semibold">Medical Notice</h3>

              <p className="mt-3 text-sm text-cyan-50">
                Predictions are generated using your local model and should not
                replace licensed medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
