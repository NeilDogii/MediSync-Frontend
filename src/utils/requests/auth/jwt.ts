"use server";

import { API } from "@/constants/environment/variables";

export async function validateToken(token: string) {
  if (!token) return null;
  try {
    const response = await fetch(`${API}/auth/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      console.error("Token validation failed:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error validating token:", error);
    return null;
  }
}
