export interface ContactRequest {
    id: number;
    name: string;
    email: string;
    phone: string;
    topic: ContactRequestType;
    message: string;
    createdAt: Date;
}

export type ContactRequestType = "general" | "support" | "feedback" | "apply" | "other";