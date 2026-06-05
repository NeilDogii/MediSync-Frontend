import Image from "next/image";
import Link from "next/link";
import WhyChooseSection from "./HeroChooseUs";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center 
                 px-6 md:px-12 pt-20 sm:pt-32 pb-7"
      style={{ backgroundImage: "url('/assets/Background.jpg')" }}
    >
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between">
        {/* HERO TEXT */}
        <div className="w-full md:w-1/2 text-center md:text-left text-white pt-10 md:pt-20 px-4 md:pl-24">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold mb-2 text-[#03045E] sm:whitespace-nowrap">
            Bridging Care Beyond Boundaries
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold mb-6 sm:whitespace-nowrap">
            — Your Doctor,{" "}
            <span className="text-[#0077B6]">Just A Click Away.</span>
          </h2>
          <p className="text-sm sm:text-base md:text-xl max-w-2xl mx-auto md:mx-0 mb-8 text-[#002b5c] font-normal">
            Seamless Virtual Healthcare That Connects{" "}
            <br className="hidden sm:block" /> Patients And Doctors Anytime,
            Anywhere.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center md:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-12 justify-center md:justify-start">
            <Link
              href="/appointment"
              className="bg-[#0074cc] hover:bg-[#005fa3] text-white 
                         px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold 
                         text-sm md:text-lg text-center w-full sm:w-auto"
            >
              Appointment
            </Link>

            <div className="flex items-center space-x-3 md:space-x-4">
              <Link
                href="/video"
                className="bg-[#0074cc] hover:bg-[#005fa3] text-white 
                          w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center 
                          justify-center text-lg md:text-xl"
              >
                ▶
              </Link>
              <span className="text-[#03045E] font-medium text-base md:text-lg">
                Watch Video
              </span>
            </div>
          </div>
        </div>

        {/* DOCTOR IMAGE SECTION */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative mt-10 md:mt-0 max-w-lg mx-auto">
          <div className="relative w-full max-w-[480px] h-[550px]">
            {/* Navy Blue Background */}
            <div
              className="absolute bg-[#03045E] rounded-3xl w-3/4 h-2/3 md:w-[450px] md:h-[400px]"
              style={{
                top: "25%",
                left: "40%",
                transform: "translateX(-40%)",
                zIndex: 0,
              }}
            />

            {/* Doctor Image */}
            <Image
              src="/assets/doctor.png"
              alt="Doctor"
              width={2000}
              height={2000}
              className="relative z-10 w-auto h-full max-h-[500px]"
              style={{
                objectFit: "cover",
                marginTop: "40px",
                marginLeft: "-15px",
              }}
            />

            {/* 24/7 Service */}
            <Image
              src="/assets/7_service.png"
              alt="24/7 Service"
              width={152}
              height={71}
              className="absolute z-20 w-[120px] h-auto md:w-[152px] md:h-[71px] 
             top-[120px] right-0 md:top-[90px] md:right-0"
            />

            {/* Our Professionals */}
            <Image
              src="/assets/proffesionals.png"
              alt="Our Professionals"
              width={175}
              height={73}
              className="absolute z-20 w-[140px] h-auto md:w-[175px] md:h-[73px]
                         bottom-[40px] left-0 md:bottom-[40px] md:left-[-10px]"
            />
          </div>
        </div>
      </div>

      {/* SEARCH BOX */}
      <WhyChooseSection />
    </section>
  );
}
