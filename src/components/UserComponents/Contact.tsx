"use client";

import { ContactRequest } from "@/@types/misc";
import { createContactRequests } from "@/utils/requests/misc/contact";
import Image from "next/image";
import React, { useState } from "react";

const topics = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Support" },
  { value: "feedback", label: "Feedback" },
  { value: "apply", label: "Doctor Application" },
  { value: "other", label: "Other" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
    acceptTerms: false,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, topic: value }));
    setDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createContactRequests({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        topic: formData.topic as unknown as ContactRequest["topic"],
        message: formData.message,
      });
      if (response) {
        alert("Form submitted successfully!");
      }
    } catch (error) {
      alert("Failed to submit contact request. Please try again.");
      console.error(error);
      return;
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <Image
        src="/assets/contactBG.jpg"
        alt="Hospital background"
        fill
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contact Form Container */}
      <div className="relative z-10 w-full max-w-md mx-auto py-15">
        {/* Glassmorphism Card */}
        <div className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-4">
            <p className="text-[#00B4D8] text-xs font-semibold uppercase tracking-wider mb-1">
              Get In Touch
            </p>
            <h1 className="text-2xl font-bold text-white mb-1">Contact Us</h1>
            <p className="text-gray-200 text-xs md:text-sm max-w-sm mx-auto">
              We&apos;d love to hear from you. Please fill out the form below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full px-3 py-2 border border-white/40 rounded-lg focus:outline-none focus:border-[#00B4D8] transition-colors bg-white/10 text-white placeholder-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full px-3 py-2 border border-white/40 rounded-lg focus:outline-none focus:border-[#00B4D8] transition-colors bg-white/10 text-white placeholder-gray-300 text-sm"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-white/40 rounded-lg focus:outline-none focus:border-[#00B4D8] transition-colors bg-white/10 text-white placeholder-gray-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full px-3 py-2 border border-white/40 rounded-lg focus:outline-none focus:border-[#00B4D8] transition-colors bg-white/10 text-white placeholder-gray-300 text-sm"
                />
              </div>
            </div>

            {/* Custom Topic Dropdown */}
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-1">
                Topic
              </label>
              {/* Visible box */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-3 py-2 border border-white/40 rounded-lg bg-white/10 text-white cursor-pointer flex justify-between items-center"
              >
                {formData.topic
                  ? topics.find((t) => t.value === formData.topic)?.label
                  : "Select one..."}
                <span className="ml-2">&#9662;</span>
              </div>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white text-[#03045E] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {topics.map((t) => (
                    <div
                      key={t.value}
                      onClick={() => handleSelect(t.value)}
                      className="px-3 py-2 hover:bg-[#00B4D8] cursor-pointer"
                    >
                      {t.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-white text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message..."
                rows={3}
                className="w-full px-3 py-2 border border-white/40 rounded-lg focus:outline-none focus:border-[#00B4D8] transition-colors bg-white/10 text-white placeholder-gray-300 resize-none text-sm"
              ></textarea>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 text-[#00B4D8] border-white/40 rounded focus:border-[#00B4D8] bg-white/10"
              />
              <label className="ml-2 text-white text-xs">
                I accept the terms
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-1">
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#00B4D8] backdrop-blur-sm text-white font-medium text-sm rounded-full hover:bg-[#00B4D8]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
