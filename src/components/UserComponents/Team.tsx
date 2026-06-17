"use client";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { Doctor } from "@/@types/doctor";

export default function Team({ doctors }: { doctors: Doctor[] }) {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-[#F7FCFF]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 rounded-full bg-[#E0F7FF] text-[#0077B6] font-medium mb-4">
            Our Experts
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-[#023E8A] mb-5">
            Meet our team members
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet our dedicated healthcare professionals committed to delivering
            exceptional medical care with expertise, compassion, and
            patient-first treatment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white border border-sky-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="relative shrink-0 w-16 h-16">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0077B6] to-[#90E0EF] p-[2px]">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F4FAFD]">
                      {doctor.avatarUrl ? (
                        <Image
                          src={doctor.avatarUrl}
                          alt={doctor.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#EAF8FF]">
                          <UserRound size={24} className="text-[#0077B6]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#023E8A] text-lg truncate">
                    {doctor.name}
                  </h3>

                  <span className="inline-block mt-1 px-2.5 py-1 rounded-full bg-[#EAF8FF] text-[#0077B6] text-xs capitalize">
                    {doctor.specialization
                      ?.toString()
                      .replace("_", " ")
                      .toLowerCase()}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 line-clamp-2 leading-6">
                {doctor.about || "No description available."}
              </p>

              <button
                onClick={() => {
                  window.location.href = `/doctors/${doctor.id}`;
                }}
                className="mt-4 w-full rounded-xl border border-[#0077B6] py-2 text-sm font-medium text-[#0077B6] hover:bg-[#0077B6] hover:text-white transition cursor-pointer"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
