"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorSignup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    specialization: "CARDIOLOGY",
    fees: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/doctor/create`,
        {
          ...formData,
          fees: Number(formData.fees),
        },
      );

      alert(
        "Doctor request submitted successfully. Please wait for admin approval.",
      );

      router.push("/doctor/login");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <Image
            src="/assets/logo.jpg"
            alt="Logo"
            width={150}
            height={40}
            className="h-10 mx-auto mb-2"
          />

          <h1 className="text-xl font-semibold text-gray-800">
            Doctor Registration
          </h1>

          <p className="text-sm text-gray-500">
            Submit your request to join the platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CARDIOLOGY">Cardiology</option>
            <option value="DERMATOLOGY">Dermatology</option>
            <option value="NEUROLOGY">Neurology</option>
            <option value="PEDIATRICS">Pediatrics</option>
            <option value="RADIOLOGY">Radiology</option>
            <option value="ONCOLOGY">Oncology</option>
            <option value="ORTHOPEDICS">Orthopedics</option>
            <option value="GYNECOLOGY">Gynecology</option>
            <option value="PSYCHIATRY">Psychiatry</option>
            <option value="GENERAL_MEDICINE">General Medicine</option>
          </select>

          <input
            type="number"
            name="fees"
            placeholder="Consultation Fees"
            value={formData.fees}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0074cc] hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <div className="flex justify-center mt-4 text-sm text-gray-600">
          <span>
            Already have an account?{" "}
            <Link
              href="/doctor/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </span>
        </div>

        <p className="text-xs text-center text-gray-400 mt-5">
          © 2025 Doctor Portal
        </p>
      </div>
    </div>
  );
}
