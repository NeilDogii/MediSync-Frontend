"use server";

import { ContactRequest } from "@/@types/misc";
import { API } from "@/constants/environment/variables";
import { revalidateTag } from "next/cache";


export async function fetchContactRequests(): Promise<ContactRequest[]> {
    const response = await fetch(`${API}/misc/contact-requests`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        next: { tags: ["cache", "admin"], revalidate: 60 * 5 },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch contact requests.");
    }

    const data = await response.json();
    return data;
}


export async function createContactRequests(
    body: Partial<ContactRequest>
): Promise<ContactRequest> {
    const response = await fetch(`${API}/misc/contact-requests`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        next: { tags: ["cache", "admin"], revalidate: 60 * 5 },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create contact request.");
    }

    const data = await response.json();
    revalidateTag("admin");
    return data;
}
