import React from "react";
import Link from "next/link";
import Navbar from "../../components/UserComponents/Navbar";
import Hero from "../../components/UserComponents/Hero";
import Get_started from "../../components/UserComponents/Get_started";
import Service_card from "../../components/UserComponents/Service_card";
import Team from "../../components/UserComponents/Team";
import Testimonial from "../../components/UserComponents/Testimonial";
import Footer from "../../components/UserComponents/Footer";
// import PatientTriageChatbot from "@/components/Chatbot/PatientTriageChatbot";

import { getCookie } from "@/utils/cookie";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";

export default async function page() {
  const token = await getCookie(PATIENT_TOKEN_KEY);

  return (
    <>
      <Navbar isLoggedIn={!!token} />
      <Hero />
        <section className="w-full bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need Quick Health Guidance?
          </h2>

          <p className="text-gray-600 mb-6">
            Describe your symptoms and get a preliminary doctor suggestion using our medical chatbot.
          </p>

          <Link
            href="/chatbot"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Open Medical Chatbot
          </Link>
        </div>
      </section>

      {/* <PatientTriageChatbot /> */}
      <Get_started />
      <Service_card />
      <Team />
      <Testimonial />

      

      <Footer />
    </>
  );
}