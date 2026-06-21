"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDoctorRecommendation } from "@/utils/requests/frontend/SearchDoctor";
import { Doctor } from "@/@types/doctor";
import { checkPatientAuth } from "@/utils/requests/auth/checkAuth";
import Popup from "@/components/global/Popup";
import UserLoginForm from "@/components/UserComponents/forms/UserLoginForm";
import UserRegisterForm from "@/components/UserComponents/forms/UserRegisterForm";

interface AppointmentData {
  name: string;
  email: string;
  description: string;
  date: string;
  time: string;
}

interface RecommendationData {
  recommendedSpecialty: string;
  recommendedDoctors: Partial<Doctor>[];
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData | null>(null);
  const [recommendations, setRecommendations] =
    useState<RecommendationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [popupType, setPopupType] = useState<"LOGIN" | "REGISTER">("LOGIN");

  const handleBookAppointment = async (doctor: Partial<Doctor>) => {
    const isAuthenticated = await checkPatientAuth();

    if (!isAuthenticated) {
      setShowAuthPopup(true);
    } else {
      // Save selected doctor to localStorage and redirect to payment
      localStorage.setItem("selectedDoctor", JSON.stringify(doctor));
      router.push("/payment");
    }
  };

  const togglePopupType = (type: "LOGIN" | "REGISTER") => {
    setPopupType(type);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("appointmentData");

    if (!storedData) {
      setError("No appointment data found. Please fill out the form first.");
      setLoading(false);
      return;
    }

    const parsedData: AppointmentData = JSON.parse(storedData);
    setAppointmentData(parsedData);

    const fetchRecommendations = async () => {
      try {
        const data = await getDoctorRecommendation({
          symptoms: parsedData.description,
        });
        setRecommendations(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch recommendations",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0077B6]"></div>
          <p className="mt-4 text-lg text-gray-700 font-medium">
            Finding the best doctors for you...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/appointment")}
            className="bg-[#0077B6] hover:bg-[#075985] text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Back to Appointment Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#003366] mb-4">
            Your Personalized Recommendations
          </h1>
          <p className="text-lg text-gray-600">
            Based on your symptoms, here&apos;s what we recommend
          </p>
        </div>

        {/* Appointment Summary */}
        {appointmentData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#003366] mb-4">
              Appointment Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-semibold">Name</p>
                <p className="text-gray-800 font-medium">
                  {appointmentData.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">Email</p>
                <p className="text-gray-800 font-medium">
                  {appointmentData.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  Preferred Date
                </p>
                <p className="text-gray-800 font-medium">
                  {appointmentData.date}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  Preferred Time
                </p>
                <p className="text-gray-800 font-medium">
                  {appointmentData.time}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 font-semibold">Symptoms</p>
                <p className="text-gray-800 font-medium">
                  {appointmentData.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Medical Advice */}
        {recommendations && (
          <>
            {/* <div className="bg-gradient-to-r from-[#0077B6] to-[#17A2B8] rounded-2xl shadow-lg p-8 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="text-3xl mr-3">💡</span>
                Medical Advice
              </h2>
              <p className="text-lg leading-relaxed">
                {recommendations.advice}
              </p>
            </div> */}

            {/* Recommended Specialty */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#003366] mb-3">
                Recommended Specialty
              </h2>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-[#0077B6]">
                <p className="text-xl font-semibold text-[#0077B6]">
                  {recommendations.recommendedSpecialty}
                </p>
              </div>
            </div>

            {/* Recommended Doctors */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#003366] mb-6">
                Recommended Doctors
              </h2>
              {recommendations.recommendedDoctors.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.recommendedDoctors.map((doctor, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-transparent hover:border-[#0077B6] transition-all hover:shadow-xl"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-[#0077B6] flex items-center justify-center text-white text-2xl font-bold mr-4">
                          {doctor.name?.charAt(0) || "D"}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#003366]">
                            Dr. {doctor.name || "Unknown"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {doctor.specialization || "Specialist"}
                          </p>
                        </div>
                      </div>

                      {doctor.email && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-500 font-semibold">
                            Email
                          </p>
                          <p className="text-gray-800 text-sm">
                            {doctor.email}
                          </p>
                        </div>
                      )}

                      {doctor.fees && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500 font-semibold">
                            Consultation Fee
                          </p>
                          <p className="text-xl font-bold text-[#0077B6]">
                            ₹{doctor.fees}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => handleBookAppointment(doctor)}
                        className="w-full mt-4 bg-[#0077B6] hover:bg-[#075985] text-white py-2 rounded-lg font-semibold transition-all"
                      >
                        Book Appointment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No doctors available at the moment. Please try again later.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  localStorage.removeItem("appointmentData");
                  router.push("/appointment");
                }}
                className="bg-[#0077B6] hover:bg-[#075985] text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
              >
                Book Another Appointment
              </button>
              <button
                onClick={() => router.push("/")}
                className="border-2 border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6] hover:text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>

      {/* Auth Popup */}
      <Popup showPopup={showAuthPopup} onChangeShowPopup={setShowAuthPopup}>
        {popupType === "LOGIN" ? (
          <UserLoginForm togglePopupType={togglePopupType} />
        ) : (
          <UserRegisterForm togglePopupType={togglePopupType} />
        )}
      </Popup>
    </div>
  );
}
