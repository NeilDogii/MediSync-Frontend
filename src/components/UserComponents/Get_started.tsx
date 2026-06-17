"use client";

import Image from "next/image";
import React from "react";

export default function GetStarted() {
  return (
    <section className="relative overflow-hidden py-20 px-6 md:px-12 bg-gradient-to-br from-[#CAF0F8] via-[#EAFBFF] to-white">
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#90E0EF]/30 blur-3xl rounded-full -translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0074cc]/10 blur-3xl rounded-full translate-x-20 translate-y-20" />

      <div className="relative max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-14">
        <div className="md:w-1/2 text-center md:text-left">
          <span className="inline-block bg-white px-4 py-1 rounded-full text-[#0074cc] font-medium shadow-sm mb-5">
            Trusted Healthcare
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-[#023E8A]">
            You have lots of reasons
            <br />
            to choose us
          </h2>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-xl">
            Experience personalized care with highly qualified doctors,
            available 24/7 to support your health journey with expertise,
            compassion, and convenience.
          </p>

          <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-5">
            {[
              { value: "10K+", label: "Happy Patients" },
              { value: "24/7", label: "Doctor Support" },
              { value: "150+", label: "Specialists" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="min-w-[150px] bg-white/70 backdrop-blur-md border border-white rounded-2xl px-6 py-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300
   "
              >
                {" "}
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#0074cc] to-[#00B4D8] bg-clip-text text-transparent">
                  {stat.value}{" "}
                </h3>
                <div className="w-10 h-[2px] bg-[#90E0EF] rounded-full my-3" />
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/assets/home_img1.png"
              alt="Medical team performing surgery"
              width={650}
              height={450}
              priority
              className="object-cover rounded-3xl hover:scale-105 transition duration-700"
            />

            <div className="absolute bottom-5 left-5 bg-white px-5 py-3 rounded-2xl shadow-lg">
              <p className="text-sm text-gray-500">Available Anytime</p>
              <h4 className="font-semibold text-[#023E8A]">
                24/7 Doctor Support
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
