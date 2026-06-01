"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-100">
      {/* Newsletter Section */}
      <div className="bg-gray-100 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Subscribe to our newsletter
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full sm:w-96 px-6 py-4 rounded-full bg-[#00A7FF30] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleSubscribe}
              className="px-8 py-4 bg-[#0077B6] hover:bg-[#0e7490] text-white font-semibold rounded-full transition-colors duration-300"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div
        className="py-12 px-6 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Background.jpg')" }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo Column */}
            <div className="lg:col-span-1 sm:col-span-2 flex flex-col items-start">
              <Image
                src="/assets/footer_logo.png"
                alt="MediSync Logo"
                width={145}
                height={145}
                className="mb-2"
              />
              <p className="text-gray-800 text-sm leading-tight">
                Copyright © 2025 Team Synapse
                <br />| All Rights Reserved
              </p>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Case studies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Contact us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Culture
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Getting started
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Help center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Server status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Report a bug
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    Chat support
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Follow us
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <Facebook size={20} /> <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <Twitter size={20} /> <span>Twitter</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <Instagram size={20} /> <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <Linkedin size={20} /> <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <Youtube size={20} /> <span>YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
