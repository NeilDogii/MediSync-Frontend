"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  text: string | React.ReactNode; // Updated to accept React components
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

// --- NEW PREMIUM RESULT CARD COMPONENT ---
const ResultCard = ({ data }: { data: PredictionResponse }) => (
  <div className="w-full space-y-4 font-sans">
    {data.urgent && (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
        <AlertTriangle className="shrink-0 mt-0.5" size={18} />
        <p className="text-sm font-medium">
          This looks urgent. Please seek immediate medical care.
        </p>
      </div>
    )}

    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-700">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Predicted Condition
        </p>
        <p className="text-xl font-bold text-[#0077B6]">{data.disease}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Confidence
          </p>
          <p className="font-semibold text-slate-800">{data.confidence}%</p>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recommended Specialist
          </p>
          <p className="font-semibold text-slate-800">{data.doctor}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Matched Symptoms
        </p>
        <div className="flex flex-wrap gap-2">
          {data.matchedSymptoms && data.matchedSymptoms.length > 0 ? (
            data.matchedSymptoms.map((sym, i) => (
              <span
                key={i}
                className="rounded-lg border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700"
              >
                {sym}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500">None identified</span>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Top Possibilities
        </p>
        <div className="space-y-2">
          {data.topDiseases.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-medium text-slate-800">
                {item.probability}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="border-t border-slate-100 pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Medical Advice
        </p>
        <p className="text-sm leading-relaxed">{data.advice}</p>
      </div> */}
    </div>
  </div>
);

export default function PatientTriageChatbot() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello 👋 Please describe your symptoms in detail. Example: I have severe chest pain and heavy sweating.",
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<"initial_symptoms" | "clarify" | "done">(
    "initial_symptoms",
  );
  const [accumulatedSymptoms, setAccumulatedSymptoms] = useState("");
  const [recommendedDoctor, setRecommendedDoctor] = useState("");
  const [loading, setLoading] = useState(false);

  const CONFIDENCE_THRESHOLD = 40.0;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const pushBot = (text: string | React.ReactNode) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const executeTriage = async (symptomQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/chatbot/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomQuery }),
      });

      const data = (await response.json()) as
        | PredictionResponse
        | { message: string };

      if (!response.ok || !("disease" in data)) {
        throw new Error(
          "message" in data ? data.message : "Prediction failed.",
        );
      }

      if (
        step === "initial_symptoms" &&
        data.confidence < CONFIDENCE_THRESHOLD
      ) {
        setAccumulatedSymptoms(symptomQuery);
        pushBot(
          "The information provided is a bit ambiguous. Could you describe your symptoms with more details, such as how long you've had them or any associated feelings?",
        );
        setStep("clarify");
        return;
      }

      setRecommendedDoctor(data.doctor);

      // Render the new card component instead of standard text
      pushBot(<ResultCard data={data} />);

      pushBot(
        "Would you like to review available specialist recommendations for your condition?",
      );
      setStep("done");
    } catch (error) {
      pushBot(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setInput("");

    if (step === "initial_symptoms") {
      await executeTriage(userInput);
    } else if (step === "clarify") {
      const combined = `${accumulatedSymptoms} ${userInput}`;
      await executeTriage(combined);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hello 👋 Please describe your symptoms in detail. Example: I have severe chest pain and heavy sweating.",
      },
    ]);
    setInput("");
    setStep("initial_symptoms");
    setAccumulatedSymptoms("");
    setRecommendedDoctor("");
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br pt-28 from-cyan-50 via-white to-blue-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-200px] top-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-[-100px] bottom-[-150px] h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] p-4 lg:p-6">
        <div className="flex flex-col-reverse sm:grid gap-5 lg:grid-cols-[330px_1fr_320px]">
          <div className="space-y-5">
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
              <button
                onClick={() => router.push("/doctors")}
                className="w-full rounded-2xl bg-[#0077B6] px-5 py-4 text-white hover:bg-[#005f92]"
              >
                Find Nearby Doctors
              </button>
            </div>

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

          <div className="rounded-[34px] bg-white shadow-2xl overflow-hidden flex flex-col">
            <div className="border-b px-6 py-5">
              <h2 className="font-semibold">MediBot</h2>
            </div>

            <div className="h-[65vh] overflow-auto p-6 scroll-smooth">
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
                        className={`px-5 py-4 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-[#0077B6] to-[#005f92] text-white rounded-2xl rounded-tr-sm"
                            : "bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-tl-sm w-full"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] gap-3">
                      <div className="rounded-full p-2 bg-slate-100 h-fit">
                        <Bot size={18} />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-100 px-5 py-4 shadow-sm flex items-center gap-1.5 h-12">
                        <div
                          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t p-5 bg-white">
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
                    disabled={loading}
                    placeholder="Describe symptoms..."
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[15px] transition-all focus:border-[#0077B6] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0077B6]/10 disabled:opacity-50"
                  />
                  <button
                    onClick={() => void handleSend()}
                    disabled={loading}
                    className="rounded-2xl bg-[#0077B6] px-6 text-white transition-opacity disabled:opacity-50 hover:bg-[#005f92]"
                  >
                    <Send />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      router.push(`/doctors?s=${recommendedDoctor}`)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0077B6] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#005f92]"
                  >
                    <Stethoscope size={18} />
                    View Suggested Doctors
                  </button>
                  <button
                    onClick={resetChat}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    <RotateCcw size={18} />
                    Start Again
                  </button>
                </div>
              )}
            </div>
          </div>

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

            <div className="rounded-[30px] bg-gradient-to-br from-[#0077B6] to-[#17A2B8] p-6 text-white shadow-xl">
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
