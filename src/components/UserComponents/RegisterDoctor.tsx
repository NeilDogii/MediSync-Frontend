"use client";

import Link from "next/link";
import {
  Stethoscope,
  Users,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function RegisterDoctor() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-cyan-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0077B6] to-[#0096C7] p-8 md:p-14 shadow-2xl">
          {/* Background Effect */}
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <div>
              <span className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                <Stethoscope size={16} />
                For Healthcare Professionals
              </span>

              <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white leading-tight">
                Join Our Network of
                <span className="block text-cyan-100">Trusted Doctors</span>
              </h2>

              <p className="mt-5 text-white/90 text-lg leading-relaxed max-w-xl">
                Expand your practice, connect with more patients, manage
                appointments effortlessly, and provide quality healthcare
                through MediSync's modern platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/doctor/login"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-[#0077B6] hover:scale-105 transition-all"
                >
                  Register as Doctor
                  <ArrowRight size={18} />
                </Link>

                <button className="rounded-2xl border border-white/40 px-6 py-3 text-white hover:bg-white/10 transition">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                <Users className="text-white mb-3" size={28} />
                <h3 className="text-white font-semibold text-lg">
                  Reach More Patients
                </h3>
                <p className="text-white/80 text-sm mt-2">
                  Grow your patient base through our healthcare network.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                <CalendarDays className="text-white mb-3" size={28} />
                <h3 className="text-white font-semibold text-lg">
                  Smart Scheduling
                </h3>
                <p className="text-white/80 text-sm mt-2">
                  Manage appointments efficiently with automated tools.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                <ShieldCheck className="text-white mb-3" size={28} />
                <h3 className="text-white font-semibold text-lg">
                  Secure Platform
                </h3>
                <p className="text-white/80 text-sm mt-2">
                  HIPAA-inspired security and patient data protection.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
                <Stethoscope className="text-white mb-3" size={28} />
                <h3 className="text-white font-semibold text-lg">
                  Online Consultations
                </h3>
                <p className="text-white/80 text-sm mt-2">
                  Deliver care remotely through video consultations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
