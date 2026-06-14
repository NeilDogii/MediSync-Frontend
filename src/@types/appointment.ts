import { Doctor } from "./doctor";

export interface AppointmentData {
  name: string;
  email: string;
  description: string;
  date: string;
  time: string;
}

export interface Appointment {
  id: number;
  condition: string;
  date: string;
  status: string;
  isPaid: boolean;
  isDoctorPaid: boolean;
  createdAt: string;
  updatedAt: string;
  doctor?: Partial<Doctor>;
  patient?: Partial<{
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    phone: string;
  }>;
  report?: {
    condition: string;
    fullReport: string;
    remedies: string;
    date: string;
    id?: string;
  };
}

declare global {
  export interface Window {
    Razorpay: RazorpayConstructor;
  }
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, callback: (response: RazorpayResponse) => void): void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id?: string;
  error?: {
    description: string;
  };
}

export interface PaymentClientProps {
  token: string;
}
