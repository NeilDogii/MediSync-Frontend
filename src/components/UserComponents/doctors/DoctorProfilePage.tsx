"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  GraduationCap,
  Award,
  CalendarDays,
  ShieldCheck,
  Send,
} from "lucide-react";
import Image from "next/image";
import { Doctor } from "@/@types/doctor";
import { createAppointment } from "@/utils/requests/appointment/appointments";
import { updateDoctor } from "@/utils/requests/data/admin";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function DoctorProfilePage({
  doctorData,
  userData,
}: {
  doctorData: Doctor;
  userData?: {
    id: number;
    name?: string;
  } | null;
}) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customDate, setCustomDate] = useState<string>("");
  const [customTime, setCustomTime] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const times = ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "04:15 PM"];

  const handlePaymentSuccess = async () => {
    try {
      const appointmentResponse = await createAppointment({
        data: {
          condition: symptoms,
          date: new Date(`${selectedDate} ${selectedTime}`),
          doctorId: doctorData.id,
          patientId: userData!.id!,
          isPaid: true,
        },
      });

      if (!appointmentResponse) {
        alert(
          "Payment was successful, but we couldn't save your appointment. Please contact support.",
        );
        return;
      }

      alert("Payment successful! Your appointment is confirmed.");

      setSelectedDate("");
      setSelectedTime("");
      setCustomDate("");
      setCustomTime("");
      setSymptoms("");
    } catch (error) {
      console.error("Failed to save appointment after payment:", error);
      alert(
        "Payment was successful, but we encountered an error saving your appointment. Please contact support.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time for your appointment.");
      return;
    }

    if (!userData) {
      window.document.getElementById("login_button")?.click();
      return;
    }

    setIsBooking(true);

    try {
      const res = await loadRazorpayScript();

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsBooking(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "YOUR_TEST_KEY_HERE",
        amount: (doctorData.fees || 500) * 100,
        currency: "INR",
        name: "Medibot Platform",
        description: `Consultation with ${doctorData.name}`,
        handler: function () {
          void handlePaymentSuccess();
        },
        theme: {
          color: "#0077B6",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentObject = new (window as any).Razorpay(options);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentObject.on("payment.failed", function (response: any) {
        console.error("Payment Failed:", response.error);
        alert(`Payment failed! Reason: ${response.error.description}`);
        setIsBooking(false);
      });

      paymentObject.open();
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert("Something went wrong while initializing payment.");
      setIsBooking(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    setIsSubmittingReview(true);

    // REPLACE THIS WITH YOUR REVIEW SUBMISSION LOGIC
    try {
      const doctorResponse = await updateDoctor({
        id: String(doctorData.id),
        data: {
          reviews: [
            ...(doctorData.reviews || []),
            {
              reviewer: userData?.name ? `${userData.name}` : "Anonymous User",
              rating,
              review: reviewText,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      });

      if (!doctorResponse) {
        alert("Failed to submit review.");
        return;
      }
      alert("Review submitted successfully!");
      setReviewText("");
      setRating(5);
    } catch (error) {
      console.error(error);
      alert("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pt-28 from-cyan-50 via-white to-blue-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-[-200px] top-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-[-100px] bottom-[-150px] h-[400px] w-[400px] rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1200px] p-4 lg:p-6">
        <Link
          href="/doctors"
          className="mb-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-md transition-all hover:-translate-x-1 hover:text-[#0077B6]"
        >
          <ArrowLeft size={18} />
          Back to Doctors
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div className="rounded-[34px] bg-white p-8 shadow-xl">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                {doctorData.avatarUrl ? (
                  <Image
                    width={120}
                    height={120}
                    src={doctorData.avatarUrl}
                    alt={doctorData.name}
                    className="h-32 w-32 rounded-[24px] object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-[24px] bg-slate-100 shadow-lg">
                    <span className="text-2xl font-bold text-slate-400">
                      {doctorData.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="mb-2 inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-[#0077B6]">
                    {String(doctorData.specialization).replaceAll("_", " ")}
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {doctorData.name}
                  </h1>
                  <p className="mt-2 text-slate-500">
                    {doctorData.education?.at(0) ||
                      "No education information available"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-amber-500">
                      <Star size={18} fill="currentColor" />
                      <span className="text-base">
                        {doctorData.reviews && doctorData.reviews.length > 0
                          ? (
                              doctorData.reviews.reduce(
                                (acc, review) => acc + review.rating,
                                0,
                              ) / doctorData.reviews.length
                            ).toFixed(1)
                          : "N/A"}
                      </span>
                      <span className="text-slate-400">
                        ({doctorData.reviews?.length || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                      <MapPin size={18} className="text-[#17A2B8]" />
                      {doctorData.worksAt || "City General Hospital"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t pt-8">
                <h3 className="mb-4 text-xl font-bold text-slate-900">
                  About Doctor
                </h3>
                <p className="leading-relaxed text-slate-600">
                  {doctorData.about ||
                    "No additional information about the doctor is available at this time."}
                </p>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 border-t pt-8">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <GraduationCap className="text-[#0077B6]" />
                    <h3 className="font-bold text-slate-900">Education</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    {doctorData.education && doctorData.education.length > 0 ? (
                      doctorData.education.map((edu, index) => (
                        <li key={index}>• {edu}</li>
                      ))
                    ) : (
                      <li>No education information available.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Award className="text-[#0077B6]" />
                    <h3 className="font-bold text-slate-900">Certifications</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-600">
                    {doctorData.certifications &&
                    doctorData.certifications.length > 0 ? (
                      doctorData.certifications.map((cert, index) => (
                        <li key={index}>• {cert}</li>
                      ))
                    ) : (
                      <li>No certification information available.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-[34px] bg-white p-8 shadow-xl">
              <h3 className="mb-6 text-xl font-bold text-slate-900">
                Patient Reviews
              </h3>

              {userData ? (
                <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">
                    Leave a review
                  </h4>
                  <div className="mb-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`transition-colors ${
                          star <= rating ? "text-amber-500" : "text-slate-300"
                        }`}
                      >
                        <Star size={24} fill="currentColor" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="mb-3 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-[#0077B6] focus:outline-none"
                    rows={3}
                    placeholder="Share your experience..."
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitReview}
                      disabled={isSubmittingReview || !reviewText.trim()}
                      className="flex items-center gap-2 rounded-xl bg-[#0077B6] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#005f92] disabled:opacity-50"
                    >
                      {isSubmittingReview ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send size={16} /> Submit
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8 rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-600">
                  Please{" "}
                  <button
                    onClick={() =>
                      document.getElementById("login_button")?.click()
                    }
                    className="font-semibold text-[#0077B6] hover:underline"
                  >
                    log in
                  </button>{" "}
                  to leave a review.
                </div>
              )}

              <div className="space-y-6">
                {doctorData.reviews && doctorData.reviews.length > 0 ? (
                  doctorData.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 font-bold text-[#0077B6]">
                            {review?.reviewer?.charAt(0) || "A"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {review?.reviewer || "Anonymous Patient"}
                            </p>
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  fill={
                                    i < review.rating ? "currentColor" : "none"
                                  }
                                  className={
                                    i < review.rating ? "" : "text-slate-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {review.review}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-slate-500">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="sticky top-32 rounded-[34px] bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Book Appointment
                </h2>
                {doctorData.fees && (
                  <span className="font-bold text-[#0077B6]">
                    ₹{doctorData.fees}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CalendarDays size={18} className="text-[#17A2B8]" />
                  Select Date
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => {
                        setCustomDate(e.target.value);
                        setSelectedDate(e.target.value);
                      }}
                      className={`h-full rounded-xl border px-3 py-2 text-sm outline-none transition-all ${
                        customDate !== "" && selectedDate === customDate
                          ? "border-[#0077B6] bg-[#0077B6] text-white shadow-md"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock size={18} className="text-[#17A2B8]" />
                  Select Time
                </div>
                <div className="flex flex-wrap gap-2">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setCustomTime("");
                      }}
                      className={`rounded-xl px-4 py-2 text-sm transition-all ${
                        selectedTime === time
                          ? "bg-[#0077B6] font-bold text-white shadow-md"
                          : "border bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                  <div className="relative flex items-center">
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => {
                        setCustomTime(e.target.value);
                        setSelectedTime(e.target.value);
                      }}
                      className={`h-full rounded-xl border px-3 py-2 text-sm outline-none transition-all ${
                        customTime !== "" && selectedTime === customTime
                          ? "border-[#0077B6] bg-[#0077B6] text-white shadow-md"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ShieldCheck size={18} className="text-[#17A2B8]" />
                  Symptoms/Reason
                </div>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full rounded-xl border bg-slate-50 p-3 text-sm text-slate-600 focus:border-[#0077B6] focus:outline-none"
                  rows={4}
                  placeholder="Describe your symptoms or reason for visit..."
                ></textarea>
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime || isBooking}
                className="flex w-full items-center justify-center rounded-2xl bg-[#0077B6] py-4 font-bold text-white shadow-lg transition-all hover:bg-[#005f92] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {isBooking ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  `Pay & Confirm Booking`
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-green-500" />
                Secure & verified booking
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
