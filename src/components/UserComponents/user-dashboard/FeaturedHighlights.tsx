"use client";

import Link from "next/link";
import {
  Video,
  ScreenShare,
  CalendarClock,
  ShieldCheck,
  Users,
  Zap,
  Wand2,
  MessageCircleQuestion,
  Clock,
  Sparkles,
  ArrowRight,
  LucideIcon,
  Stethoscope,
  Bot,
  PhoneOff,
  Send,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const videoFeatures: Feature[] = [
  {
    icon: Video,
    title: "HD Video Calls",
    desc: "Crystal-clear video quality for every consultation session.",
  },
  {
    icon: ScreenShare,
    title: "Screen Sharing",
    desc: "Share reports, scans, and documents with your doctor live.",
  },
  {
    icon: CalendarClock,
    title: "Meeting Scheduling",
    desc: "Book a consultation slot that works around your schedule.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Communication",
    desc: "End-to-end encrypted calls keep your data fully private.",
  },
  {
    icon: Users,
    title: "Multi-Participant Meetings",
    desc: "Invite family members or specialists into the same call.",
  },
];

const chatbotFeatures: Feature[] = [
  {
    icon: Zap,
    title: "Instant Support",
    desc: "Get immediate responses without waiting in a queue.",
  },
  {
    icon: Wand2,
    title: "Smart Responses",
    desc: "AI-driven answers tailored precisely to your questions.",
  },
  {
    icon: MessageCircleQuestion,
    title: "FAQ Assistance",
    desc: "Quick clarity on common health and platform queries.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    desc: "Support that never sleeps — whenever you need it most.",
  },
  {
    icon: Sparkles,
    title: "Personalized Recommendations",
    desc: "Guidance shaped around your symptoms and health history.",
  },
];

function FeatureItem({ icon: Icon, title, desc }: Feature) {
  return (
    <div className="group flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:border-[#0077B6]/50 hover:translate-x-1 cursor-default">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[#E0F7FF] text-[#0077B6] flex items-center justify-center transition-colors duration-200 group-hover:bg-[#0077B6] group-hover:text-white">
        <Icon size={15} />
      </div>
      <div>
        <h4 className="text-[13px] font-semibold text-gray-800 mb-0.5">
          {title}
        </h4>
        <p className="text-[12px] text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Video Conferencing mock UI panel ─── */
function VideoPanel() {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="bg-[#0077B6] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] opacity-80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] opacity-80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] opacity-80" />
        </div>
        <span className="text-xs text-white/80 font-medium">
          Consultation Room
        </span>
      </div>

      <div className="bg-white p-4">
        {/* Main video area */}
        <div className="relative w-full aspect-video bg-[#0a1628] rounded-xl flex flex-col items-center justify-center gap-2 mb-3 overflow-hidden">
          <span className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-500/90 text-white text-[10px] font-medium px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live
          </span>
          <div className="w-12 h-12 rounded-full bg-[#1a3a5c] border-2 border-[#1e5080] flex items-center justify-center text-[#4da8d4]">
            <Stethoscope size={20} />
          </div>
          <p className="text-[11px] text-white/60">
            Dr. Priya Sharma · Cardiologist
          </p>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {["Patient", "Family", "Screen"].map((label) => (
            <div
              key={label}
              className="aspect-video bg-[#0f2235] rounded-lg flex items-center justify-center border border-[#1e3a55]"
            >
              <span className="text-[10px] text-white/30">{label}</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {[Video, ScreenShare, Users].map((Icon, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center text-[#4da8d4]"
            >
              <Icon size={14} />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white">
            <PhoneOff size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Chat mock UI panel ─── */
const mockMessages = [
  {
    from: "bot",
    text: "Hello! I'm your AI health assistant. How can I help you today?",
  },
  { from: "user", text: "I've had a headache for two days. What should I do?" },
  {
    from: "bot",
    text: "A two-day headache can have several causes. Rest, hydration, and avoiding screens help. If it persists, I can help you book a neurologist.",
  },
  { from: "user", text: "Yes, please book one for me." },
  {
    from: "bot",
    text: "Sure! I found 3 available neurologists this week. Shall I show you the earliest slot?",
  },
];

function ChatPanel() {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="bg-[#0077B6] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] opacity-80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] opacity-80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] opacity-80" />
        </div>
        <span className="text-xs text-white/80 font-medium">
          AI Health Assistant
        </span>
      </div>

      <div className="bg-white p-4 flex flex-col gap-2.5">
        {/* Online status */}
        <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-[11px] text-gray-400">
            Assistant is online and ready
          </span>
        </div>

        {/* Messages */}
        {mockMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] ${
                msg.from === "bot"
                  ? "bg-[#E0F7FF] text-[#0077B6]"
                  : "bg-[#0077B6] text-white"
              }`}
            >
              {msg.from === "bot" ? <Bot size={12} /> : <Users size={12} />}
            </div>
            <div
              className={`max-w-[78%] px-3 py-2 text-[12px] leading-relaxed ${
                msg.from === "bot"
                  ? "bg-gray-50 text-gray-700 border border-gray-100 rounded-tl-sm rounded-tr-xl rounded-br-xl rounded-bl-xl"
                  : "bg-[#0077B6] text-white rounded-tl-xl rounded-tr-sm rounded-br-xl rounded-bl-xl"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Input row */}
        <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-full">
          <span className="flex-1 text-[12px] text-gray-300">
            Type a message…
          </span>
          <div className="w-6 h-6 rounded-full bg-[#0077B6] flex items-center justify-center text-white">
            <Send size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Pill badge ─── */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#0077B6] bg-[#E0F7FF] px-3 py-1 rounded-full mb-3">
      {children}
    </span>
  );
}

/* ─── CTA button ─── */
function CtaButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0077B6] hover:bg-[#005fa3] text-white font-medium text-sm rounded-full transition-all duration-300 hover:gap-3 shadow-sm"
    >
      {children}
      <ArrowRight size={14} />
    </Link>
  );
}

/* ─── Main export ─── */
export default function FeaturedHighlights() {
  return (
    <>
      {/* VIDEO CONFERENCING */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy + feature list */}
          <div>
            <Pill>
              <Video size={11} />
              Video Conferencing
            </Pill>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-3 leading-tight">
              Consult doctors face-to-face,
              <br className="hidden md:block" /> from anywhere
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
              Our HD video consultation platform lets you connect with verified
              healthcare professionals in real time — no travel, no waiting
              rooms. Secure, private, and designed around your comfort.
            </p>
            <div className="flex flex-col gap-2.5 mb-7">
              {videoFeatures.map((f) => (
                <FeatureItem key={f.title} {...f} />
              ))}
            </div>
            <CtaButton href="/appointment">Book Now</CtaButton>
          </div>

          {/* Right: static mock UI */}
          <VideoPanel />
        </div>
      </section>

      {/* AI CHATBOT */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: static mock UI (reversed on desktop) */}
          <div className="order-last lg:order-first">
            <ChatPanel />
          </div>

          {/* Right: copy + feature list */}
          <div>
            <Pill>
              <Bot size={11} />
              AI MediBot
            </Pill>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0077B6] mb-3 leading-tight">
              Instant health guidance,
              <br className="hidden md:block" /> available 24/7
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
              Our AI Health Assistant is always on — answering questions,
              assessing symptoms, and helping you navigate the platform at any
              hour of the day. Smart, fast, and built for healthcare.
            </p>
            <div className="flex flex-col gap-2.5 mb-7">
              {chatbotFeatures.map((f) => (
                <FeatureItem key={f.title} {...f} />
              ))}
            </div>
            <CtaButton href="/chatbot">Open Chatbot</CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
