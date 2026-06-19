"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MapPin, Search, Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Doctor } from "@/@types/doctor";

// const mockDoctors = [
//   {
//     id: "1",
//     name: "Dr. Sarah Jenkins",
//     specialty: "Cardiologist",
//     rating: 4.9,
//     reviews: 128,
//     location: "City General Hospital",
//     experience: "15 years",
//     image: "https://i.pravatar.cc/150?u=1",
//   },
//   {
//     id: "2",
//     name: "Dr. Michael Chen",
//     specialty: "Neurologist",
//     rating: 4.8,
//     reviews: 94,
//     location: "Westside Clinic",
//     experience: "12 years",
//     image: "https://i.pravatar.cc/150?u=2",
//   },
//   {
//     id: "3",
//     name: "Dr. Emily Rodriguez",
//     specialty: "Pediatrician",
//     rating: 4.9,
//     reviews: 215,
//     location: "Children's Health Center",
//     experience: "8 years",
//     image: "https://i.pravatar.cc/150?u=3",
//   },
//   {
//     id: "4",
//     name: "Dr. James Wilson",
//     specialty: "Orthopedic Surgeon",
//     rating: 4.7,
//     reviews: 156,
//     location: "Sports Med Institute",
//     experience: "20 years",
//     image: "https://i.pravatar.cc/150?u=4",
//   },
// ];

export default function DoctorsListPage({
  doctors,
  search,
}: {
  doctors: Doctor[];
  search: string;
}) {
  const [searchQuery, setSearchQuery] = useState(search);
  const data = doctors.map((doctor) => ({
    id: doctor.id,
    name: doctor.name,
    specialty: String(doctor.specialization).replaceAll("_", " ").toLowerCase(),
    rating:
      (doctor?.reviews?.reduce((acc, review) => acc + review.rating, 0) ?? 0) /
        (doctor?.reviews?.length ?? 1) || 0,
    reviews: doctor.reviews,
    location: doctor.worksAt || "Unknown Location",
    education: doctor.education?.at(0) || "Unknown Education",
    image: doctor.avatarUrl || null,
  }));

  const filteredDoctors = data.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(doc.specialty).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br pt-28 from-cyan-50 via-white to-blue-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-200px] top-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-[-100px] bottom-[-150px] h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1600px] p-4 lg:p-6">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Find a Doctor</h1>
            <p className="mt-2 text-slate-600">
              Book appointments with top-rated medical professionals.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[20px] border-none bg-white p-4 pl-12 shadow-lg outline-none ring-2 ring-transparent focus:ring-[#0077B6]"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group flex flex-col rounded-[30px] bg-white p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-start gap-4">
                {doctor.image ? (
                  <Image
                    width={80}
                    height={80}
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-20 w-20 rounded-[20px] object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-slate-100 shadow-sm">
                    <span className="text-2xl font-bold text-slate-400">
                      {doctor.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    {doctor.name}
                  </h3>
                  <p className="font-medium text-[#0077B6] capitalize">
                    {doctor.specialty}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-sm font-medium text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <span>{doctor.rating?.toFixed(1) || "N/A"}</span>
                    <span className="text-slate-400">
                      ({doctor.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-[20px] bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin size={16} className="text-[#17A2B8]" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar size={16} className="text-[#17A2B8]" />
                  <span>{doctor.education}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/doctors/${doctor.id}`}
                  className="flex flex-1 items-center justify-center rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-[#0077B6] transition-colors hover:bg-cyan-100"
                >
                  View Profile
                </Link>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0077B6] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#005f92]">
                  Request
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
