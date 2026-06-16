import React from "react";
import Hero from "../../../../components/UserComponents/Hero";
import Get_started from "../../../../components/UserComponents/Get_started";
import Service_card from "../../../../components/UserComponents/Service_card";
import Team from "../../../../components/UserComponents/Team";
import Testimonial from "../../../../components/UserComponents/Testimonial";
import Footer from "../../../../components/UserComponents/Footer";
import FeaturedHighlights from "@/components/UserComponents/user-dashboard/FeaturedHighlights";

export default async function page() {
  return (
    <>
      <Hero />
      <div className="h-20 bg-gradient-to-b from-white to-[#CAF0F8]"></div>
      <Get_started />
      <Service_card />
      <FeaturedHighlights />
      <Team />
      <Testimonial />
      <Footer />
    </>
  );
}
