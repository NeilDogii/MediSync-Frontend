import { CalendarCheck, ShieldCheck, Clock3, Stethoscope } from "lucide-react";

export default function WhyChooseSection() {
  const features = [
    {
      icon: <CalendarCheck size={24} />,
      title: "Easy Appointments",
      desc: "Book consultations in seconds with a smooth scheduling flow.",
    },

    {
      icon: <Clock3 size={24} />,
      title: "24/7 Availability",
      desc: "Connect with doctors anytime from anywhere.",
    },

    {
      icon: <ShieldCheck size={24} />,
      title: "Secure Platform",
      desc: "Protected patient data and encrypted communication.",
    },

    {
      icon: <Stethoscope size={24} />,
      title: "Verified Doctors",
      desc: "Professional healthcare providers you can trust.",
    },
  ];

  return (
    <section className=" max-w-8xl mx-auto mt-20 rounded-[36px] bg-white shadow-xl p-8 relative z-20">
      {/* Heading */}

      <div className="text-center mb-8">
        <p className="text-[#0B6CB8] font-semibold">Why Choose MediSync</p>

        <h2 className="text-4xl font-bold mt-2">Healthcare Made Simpler</h2>

        <p className="text-slate-500 mt-3">
          Everything you need for fast and reliable healthcare.
        </p>
      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-4 max-sm:grid-cols-1 gap-5">
        {features.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-100 p-6 hover:-translate-y-1 hover:shadow-lg transition flex shadow-sm flex-col max-sm:items-center max-sm:text-center"
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] text-white flex items-center justify-center mb-5">
              {item.icon}
            </div>

            <h3 className="font-bold text-lg">{item.title}</h3>

            <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
