"use client";

import { useEffect, useState } from "react";
import { Patient } from "@/@types/patient";
import { getCookie } from "@/utils/cookie";
import { PATIENT_TOKEN_KEY } from "@/constants/keys";
import { API } from "@/constants/environment/variables";
import { User, Mail, Phone, Calendar, Edit2, Check, X } from "lucide-react";

export default function DashboardPage({ userId }: { userId: string }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "MALE" as const,
  });

  useEffect(() => {
    fetchPatientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchPatientData = async () => {
    try {
      const token = await getCookie(PATIENT_TOKEN_KEY);
      if (!token) return;

      const response = await fetch(`${API}/auth/validate-user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatient(data);
        setEditData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          age: data.age?.toString() || "",
          gender: data.gender || "MALE",
        });
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const token = await getCookie(PATIENT_TOKEN_KEY);
      if (!token) return;

      const response = await fetch(`${API}/auth/update-user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          phone: editData.phone,
          age: editData.age ? parseInt(editData.age) : undefined,
          gender: editData.gender,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating patient data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#0074cc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-7 px-4 pb-10 ">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#0074cc] to-[#005fa3] px-6 md:px-8 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-[#0074cc] shadow-md">
                    {patient?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {patient?.name}
                    </h2>
                    <p className="text-blue-100">Patient Account</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-[#0074cc] px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 size={18} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {isEditing ? (
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0074cc] transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Grid for Email, Phone, Age */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0074cc] transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0074cc] transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Age and Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={editData.age}
                        onChange={(e) =>
                          setEditData({ ...editData, age: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0074cc] transition-all"
                        placeholder="Enter your age"
                        min="0"
                        max="150"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={editData.gender}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            gender: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0074cc] transition-all"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="flex-1 bg-[#0074cc] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-[#005fa3] transition-colors disabled:opacity-50"
                    >
                      <Check size={18} />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-300 transition-colors"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Info Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="p-3 bg-[#0074cc] rounded-lg">
                        <User size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {patient?.name}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="p-3 bg-[#0074cc] rounded-lg">
                        <Mail size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {patient?.email}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="p-3 bg-[#0074cc] rounded-lg">
                        <Phone size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {patient?.phone}
                        </p>
                      </div>
                    </div>

                    {/* Age */}
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="p-3 bg-[#0074cc] rounded-lg">
                        <Calendar size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {patient?.age || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Gender Info */}
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-sm text-gray-600 mb-1">Gender</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {patient?.gender?.replace(/_/g, " ")}
                    </p>
                  </div>

                  {/* Account Info */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Account Created</p>
                        <p className="font-semibold text-gray-800">
                          {patient?.createdAt
                            ? new Date(patient.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Updated</p>
                        <p className="font-semibold text-gray-800">
                          {patient?.updatedAt
                            ? new Date(patient.updatedAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
