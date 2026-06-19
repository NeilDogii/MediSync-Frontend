"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I book an online consultation?",
    answer:
      "Simply choose an available time slot, and fill out the appointment form. Then you can check out your appointment details in your account dashboard. You will receive a confirmation email with the consultation link.",
  },
  {
    question: "What should I prepare before my medisync appointment?",
    answer:
      "Ensure you have a stable internet connection, a working camera and microphone, and any relevant medical records or test results. Be in a quiet, well-lit space for the consultation.",
  },
  {
    question: "Are medisync consultations as effective as in-person visits?",
    answer:
      "Yes, for many conditions, virtual consultations are equally effective. Our doctors can diagnose, prescribe medications, and provide treatment plans. For cases requiring physical examination, we'll recommend an in-person visit.",
  },
  {
    question: "How long does a typical consultation last?",
    answer:
      "Most consultations last between 15-30 minutes, depending on the complexity of your condition. You'll have sufficient time to discuss your concerns with the doctor.",
  },
  {
    question: "Can I get a prescription through medisync?",
    answer:
      "Yes, our doctors can prescribe medications during your virtual consultation. Prescriptions will be sent directly to your preferred pharmacy or made available for download.",
  },
  {
    question: "Is my medical information secure and confidential?",
    answer:
      "Absolutely. We use encrypted, HIPAA-compliant platforms to ensure your medical information and consultations remain completely private and secure.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards, UPI, net banking, and health insurance. Payment is processed securely through our encrypted payment gateway.",
  },
  {
    question: "Can I reschedule or cancel my appointment?",
    answer:
      "Yes, you can reschedule or cancel your appointment up to 2 hours before the scheduled time by contacting our support team.",
  },
  {
    question: "What if I have technical issues during my consultation?",
    answer:
      "Our technical support team is available 24/7 to help you. You can also access troubleshooting guides in the help section or contact us via phone for immediate assistance.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0077B6] mb-4">
            FAQ
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Common questions about our telemedicine services and how to make the
            most of your virtual healthcare experience
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start justify-between p-6 text-left focus:outline-none group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <ChevronDown
                    className={`w-5 h-5 text-[#17A2B8] mt-1 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-[#17A2B8] transition-colors pr-4">
                    {faq.question}
                  </h3>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pl-16">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="bg-[#0077B6] hover:bg-[#075985] text-white font-semibold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <a href="/contact">Contact Support</a>
          </button>
        </div>
      </div>
    </div>
  );
}
