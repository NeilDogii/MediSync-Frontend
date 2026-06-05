"use client";
import Image from "next/image";
import React from "react";

export default function Get_started() {
  return (
    <section className="bg-[#CAF0F8] py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#0074cc] mb-4">
            You have lots of reasons <br /> to choose us
          </h2>
          <p className="text-gray-600 mb-8">
            Experience personalized care with our highly qualified doctors,
            available 24/7. Your health is our priority, always.
          </p>
          <button className="bg-[#0074cc] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-[#005fa3] transition-all duration-300">
            Get started
          </button>
        </div>

        {/* Right Image Section */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <Image
            src="/assets/home_img1.png"
            alt="Medical team performing surgery"
            width={600}
            height={400}
            className="rounded-xl object-cover shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
