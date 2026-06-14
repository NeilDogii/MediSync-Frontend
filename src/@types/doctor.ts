import { Base } from "./_base";
import { Appointment } from "./appointment";
import { DoctorSpecialization } from "./enum";

export interface Doctor extends Base {
  name: string;
  username: string;
  password: string;
  specialization: DoctorSpecialization;
  phone: string;
  email: string;
  fees?: number;
  avatarUrl?: string;

  worksAt?: string;
  about?: string;
  education?: string[];
  certifications?: string[];

  reviews?: DoctorReview[];
}

export interface DoctorReview {
  reviewer: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface DoctorReport {
  id: string;
  condition: string;
  fullReport: string;
  remedies: string;
  date: Date;
  appointmentId: number;
  appointment: Appointment;
}
