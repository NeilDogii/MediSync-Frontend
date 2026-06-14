"use client";

import Link from "next/link";
import { Home, ArrowLeft, HeartCrack, Stethoscope } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-blue-100 p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-200px] top-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-[-100px] bottom-[-150px] h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="rounded-[40px] bg-white p-10 shadow-2xl">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-50">
            <HeartCrack
              className="h-12 w-12 text-[#0077B6]"
              strokeWidth={1.5}
            />
          </div>

          <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">
            Diagnosis: 404
          </h1>

          <h2 className="mb-6 text-xl font-medium text-[#0077B6]">
            Page Not Found
          </h2>

          <p className="mb-10 text-slate-500 leading-relaxed">
            It looks like this link flatlined. The page you are looking for
            might have been removed, had its name changed, or is temporarily
            unavailable.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#0077B6] px-6 py-4 text-white transition-all hover:bg-[#005f92] hover:shadow-lg"
            >
              <Home size={18} />
              <span className="font-medium">Back to Homepage</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Previous Page</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Stethoscope size={16} />
          <span>Need a second opinion?</span>
          <Link
            href="/support"
            className="font-medium text-[#0077B6] hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
