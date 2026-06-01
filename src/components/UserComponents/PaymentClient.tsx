"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Doctor } from "@/@types/doctor";
import { checkPatientAuth } from "@/utils/requests/auth/checkAuth";
import type {
  PaymentClientProps,
  AppointmentData,
  RazorpayResponse,
  RazorpayOptions,
} from "@/@types/appointment";
import { createAppointment } from "@/utils/requests/appointment/appointments";

export default function PaymentClient({ token }: PaymentClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Partial<Doctor> | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState<Date | null>(
    null
  );

  const extractUserIdFromToken = (jwtToken: string): string | null => {
    try {
      const parts = jwtToken.split(".");
      if (parts.length !== 3) {
        console.error("Invalid JWT token format");
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return payload.id || payload.userId || payload.sub || null;
    } catch (error) {
      console.error("Error extracting user ID from token:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkPatientAuth();
      if (!isAuthenticated) {
        router.push("/recommendations");
        return;
      }

      const extractedUserId = extractUserIdFromToken(token);
      setUserId(extractedUserId);

      const storedAppointment = localStorage.getItem("appointmentData");
      const storedDoctor = localStorage.getItem("selectedDoctor");

      if (!storedAppointment || !storedDoctor) {
        alert("Missing appointment or doctor data");
        router.push("/appointment");
        return;
      }

      setAppointmentData(JSON.parse(storedAppointment));
      setSelectedDoctor(JSON.parse(storedDoctor));
      setLoading(false);
    };

    checkAuth();
  }, [router, token]);

  useEffect(() => {
    if (appointmentData) {
      function mergeDateTime(date: Date, timeString: string) {
        const newDate = new Date(date.getTime());

        const [time, modifier] = timeString.split(" ");
        // eslint-disable-next-line prefer-const
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
      }
      const combined = mergeDateTime(
        new Date(appointmentData.date),
        appointmentData.time
      );

      setAppointmentDateTime(combined);
    }
  }, [appointmentData]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      alert("Failed to load payment gateway. Please refresh the page.");
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = () => {
    if (!selectedDoctor || !appointmentData) return;

    setIsProcessing(true);

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      alert("Razorpay key is not configured. Please contact support.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: (selectedDoctor.fees || 500) * 100,
      currency: "INR",
      name: "MediSync",
      description: `Consultation with Dr. ${selectedDoctor.name}`,
      image: "/assets/logo.jpg",
      handler: function (response: RazorpayResponse) {
        setIsProcessing(false);
        alert(
          "Payment successful! Payment ID: " + response.razorpay_payment_id
        );

        console.log("User ID:", userId);
        console.log("Payment ID:", response.razorpay_payment_id);

        createAppointment({
          data: {
            condition: appointmentData.description,
            date: appointmentDateTime!,
            doctorId: selectedDoctor.id!,
            patientId: parseInt(userId!),
            isPaid: true,
          },
        }).then((res) => {
          if (res) {
            alert("Appointment created successfully!");
            router.push("/");
          } else {
            alert("Failed to create appointment. Please contact support.");
          }
        });

        localStorage.removeItem("appointmentData");
        localStorage.removeItem("selectedDoctor");
        router.push("/");
      },
      prefill: {
        name: appointmentData.name,
        email: appointmentData.email,
      },
      theme: {
        color: "#0077B6",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    if (!window.Razorpay) {
      alert("Payment gateway is not available. Please refresh the page.");
      setIsProcessing(false);
      return;
    }

    const rzp = new window.Razorpay(options as RazorpayOptions);
    rzp.on("payment.failed", function (response: RazorpayResponse) {
      setIsProcessing(false);
      alert("Payment failed: " + response.error?.description);
    });
    rzp.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0077B6]"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Complete Your Payment
          </h1>
          <p className="text-lg text-gray-600">
            Secure payment for your appointment
          </p>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Doctor Information */}
          {selectedDoctor && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#003366] mb-4">
                Doctor Details
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[#0077B6] flex items-center justify-center text-white text-3xl font-bold">
                  {selectedDoctor.name?.charAt(0) || "D"}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Dr. {selectedDoctor.name || "Unknown"}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {selectedDoctor.specialization || "Specialist"}
                  </p>
                  {selectedDoctor.email && (
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedDoctor.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Appointment Details */}
          {appointmentData && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#003366] mb-4">
                Appointment Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">
                    Patient Name
                  </p>
                  <p className="text-gray-800 font-medium text-lg">
                    {appointmentData.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Email</p>
                  <p className="text-gray-800 font-medium text-lg">
                    {appointmentData.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Date</p>
                  <p className="text-gray-800 font-medium text-lg">
                    {appointmentData.date}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Time</p>
                  <p className="text-gray-800 font-medium text-lg">
                    {appointmentData.time}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 font-semibold">
                    Symptoms
                  </p>
                  <p className="text-gray-800 font-medium">
                    {appointmentData.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#003366] mb-4">
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="text-gray-800 font-medium">
                  ₹{selectedDoctor?.fees || 500}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Charge</span>
                <span className="text-gray-800 font-medium">₹0</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-[#0077B6]">
                    ₹{selectedDoctor?.fees || 500}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all shadow-lg ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0077B6] hover:bg-[#075985] text-white hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Processing...
              </span>
            ) : (
              "Pay with Razorpay"
            )}
          </button>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🔒 Secure payment powered by Razorpay
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/recommendations")}
            className="border-2 border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6] hover:text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Back to Recommendations
          </button>
          <button
            onClick={() => router.push("/")}
            className="border-2 border-gray-400 text-gray-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
