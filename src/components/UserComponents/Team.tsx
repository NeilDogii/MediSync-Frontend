"use client";

import Image from "next/image";
import {
  UserRound,
  Star,
  GraduationCap,
  BriefcaseMedical,
  ArrowRight,
} from "lucide-react";

import { Doctor } from "@/@types/doctor";

export default function Team({ doctors }: { doctors: Doctor[] }) {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-white via-sky-50/40 to-cyan-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full bg-sky-100 px-5 py-2 text-sm font-semibold text-sky-700">
            Our Medical Experts
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl font-bold text-slate-900">
            Meet Our Specialists
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-slate-600 leading-8">
            Experienced healthcare professionals dedicated to delivering
            compassionate and world-class patient care.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="relative h-24 bg-gradient-to-br from-[#0077B6] via-sky-500 to-cyan-400">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent)]" />

                <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2">
                  <div className="relative h-32 w-32 rounded-full border-[6px] border-white overflow-hidden bg-white shadow-xl">
                    {doctor.avatarUrl ? (
                      <Image
                        src={doctor.avatarUrl}
                        alt={doctor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-sky-50">
                        <UserRound size={42} className="text-sky-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-20 px-6 pb-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {doctor.name}
                  </h3>

                  <p className="capitalize mt-2 inline-flex rounded-full bg-sky-50 px-4 py-1 text-sm font-medium text-sky-700">
                    {String(doctor.specialization)
                      ?.replaceAll("_", " ")
                      .toLowerCase()}
                  </p>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  {doctor.worksAt && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <BriefcaseMedical size={18} />
                      <span>{doctor.worksAt}</span>
                    </div>
                  )}

                  {doctor.education?.[0] && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <GraduationCap size={18} />
                      <span className="truncate">{doctor.education[0]}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    {doctor.fees && (
                      <div>
                        <p className="text-xs text-slate-400">Consultation</p>
                        <p className="font-semibold text-slate-900">
                          ₹{doctor.fees}
                        </p>
                      </div>
                    )}

                    <div className="text-right">
                      <p className="text-xs text-slate-400">Reviews</p>

                      <div className="flex items-center gap-1 justify-end">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />

                        <span className="font-semibold">
                          {doctor.reviews?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-500 line-clamp-3 mb-auto">
                  {doctor.about ||
                    "Dedicated to providing patient-focused healthcare and quality treatment."}
                </p>

                <button
                  onClick={() =>
                    (window.location.href = `/doctors/${doctor.id}`)
                  }
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#0077B6] to-[#0096C7] py-3 text-white font-medium flex items-center justify-center gap-2 hover:gap-4 transition-all"
                >
                  View Profile
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
