"use client";

import { useEffect, useState } from "react";
import { Appointment } from "@/@types/appointment";
import { getCookie } from "@/utils/cookie";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";
import { API } from "@/constants/environment/variables";
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

export default function PaymentsPage({ userId }: { userId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchAppointments = async () => {
    try {
      const token = await getCookie(PATIENT_TOKEN_KEY);
      if (!token) return;

      const response = await fetch(
        `${API}/appointment/patient-appointments/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = appointments.reduce((sum, appointment) => {
    return sum + (appointment.doctor?.fees || 0);
  }, 0);

  const paidAmount = appointments
    .filter((apt) => apt.isPaid)
    .reduce((sum, appointment) => {
      return sum + (appointment.doctor?.fees || 0);
    }, 0);

  const pendingAmount = totalAmount - paidAmount;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0074cc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br rounded-xl from-blue-50 to-indigo-100">
      <div className="pt-7 px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Payments</h1>
            <p className="text-gray-600">
              View and manage your appointment payments
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Amount Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-semibold mb-1">
                      Total Amount
                    </p>
                    <h3 className="text-3xl font-bold text-white">
                      ₹{totalAmount.toLocaleString()}
                    </h3>
                  </div>
                  <DollarSign size={40} className="text-blue-200 opacity-50" />
                </div>
              </div>
            </div>

            {/* Paid Amount Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-semibold mb-1">
                      Paid Amount
                    </p>
                    <h3 className="text-3xl font-bold text-white">
                      ₹{paidAmount.toLocaleString()}
                    </h3>
                  </div>
                  <CheckCircle
                    size={40}
                    className="text-green-200 opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Pending Amount Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-semibold mb-1">
                      Pending Amount
                    </p>
                    <h3 className="text-3xl font-bold text-white">
                      ₹{pendingAmount.toLocaleString()}
                    </h3>
                  </div>
                  <AlertCircle
                    size={40}
                    className="text-orange-200 opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payments List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Payment Details
              </h2>

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard
                    size={48}
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <p className="text-gray-600">
                    No appointments yet. Book an appointment to see payment
                    details.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Appointment ID
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Doctor
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                        >
                          <td className="py-4 px-4 text-gray-800 font-semibold">
                            #{appointment.id}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Stethoscope
                                  size={18}
                                  className="text-[#0074cc]"
                                />
                              </div>
                              <span className="text-gray-800">
                                {appointment.doctor?.name || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-800">
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-bold text-[#0074cc] text-lg">
                              ₹{appointment.doctor?.fees || 0}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {appointment.isPaid ? (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-green-700 font-semibold">
                                  Paid
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                <span className="text-orange-700 font-semibold">
                                  Pending
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Quick Pay Section */}
          {pendingAmount > 0 && (
            <div className="mt-8 bg-gradient-to-r from-[#0074cc] to-[#005fa3] rounded-2xl shadow-lg p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Outstanding Amount
                  </h3>
                  <p className="text-blue-100 mb-4">
                    You have a pending payment of ₹
                    {pendingAmount.toLocaleString()}
                  </p>
                </div>
                <button className="bg-white text-[#0074cc] px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors whitespace-nowrap">
                  <span>Pay Now</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
