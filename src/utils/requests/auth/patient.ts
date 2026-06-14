"use server";

import { API } from "@/constants/environment/variables";

export async function PatientLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  if (!email || email.trim() === "" || !password || password.trim() === "") {
    return { success: false, message: "email and password are required." };
  }

  const response = await fetch(`${API}/auth/patient/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { success: false, message: errorData.message || "Login failed." };
  }

  const data = await response.json();
  return { success: true, token: data.token };
}

export async function PatientRegister({
  email,
  phone,
  name,
  password,
}: {
  email: string;
  phone: string;
  name: string;
  password: string;
}) {
  if (
    !email ||
    email.trim() === "" ||
    !phone ||
    phone.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    return { success: false, message: "All fields are required." };
  }

  const response = await fetch(`${API}/auth/patient/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, phone, name, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      success: false,
      message: errorData.message || "Registration failed.",
    };
  }

  const data = await response.json();
  return { success: true, token: data.token };
}
