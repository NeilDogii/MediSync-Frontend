"use client";

import React, { useState, useRef } from "react";
import {
  IndianRupeeIcon,
  Mail,
  Phone,
  User,
  Camera,
  Loader2,
  Building2,
  FileText,
  GraduationCap,
  Award,
  X,
  Plus,
} from "lucide-react";
import { DoctorSpecialization } from "@/@types/enum";
import { Doctor } from "@/@types/doctor";
import {
  updateDoctorSettings,
  uploadDoctorAvatar,
} from "@/utils/requests/misc/doctor";
import Image from "next/image";

export default function DoctorSettings({
  doctorId,
  data,
}: {
  doctorId: number;
  data: Doctor | null;
}) {
  const [form, setForm] = useState({
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    specialization: data?.specialization || DoctorSpecialization.CARDIOLOGY,
    fees: data?.fees || 0,
    worksAt: data?.worksAt || "",
    about: data?.about || "",
    education: data?.education || [],
    certifications: data?.certifications || [],
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    data?.avatarUrl || null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (
    field: "education" | "certifications",
    index: number,
    value: string,
  ) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const addArrayItem = (field: "education" | "certifications") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };

  const removeArrayItem = (
    field: "education" | "certifications",
    index: number,
  ) => {
    const newArray = [...form[field]];
    newArray.splice(index, 1);
    setForm({ ...form, [field]: newArray });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 2;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Image size must be less than ${MAX_SIZE_MB}MB`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let uploadedAvatarUrl = data?.avatarUrl || "";

      if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer();

        const blob = new Blob([arrayBuffer], { type: selectedFile.type });
        const formData = new FormData();
        formData.append("image", blob, selectedFile.name);

        const uploadResponse = await uploadDoctorAvatar(formData);

        if (!uploadResponse) throw new Error("Image upload failed");

        uploadedAvatarUrl = uploadResponse.url;
      }

      await updateDoctorSettings(doctorId, {
        ...form,
        avatarUrl: uploadedAvatarUrl,
      });

      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("An error occurred while saving your settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ml-64 min-h-screen bg-slate-50 p-8">
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0F4C81] via-[#0B6CB8] to-[#38BDF8] p-8 shadow-xl">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-2">Doctor Portal</p>
            <h1 className="text-4xl font-bold text-white">Settings</h1>
            <p className="text-blue-100 mt-2">
              Manage account preferences, notifications and security.
            </p>
          </div>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute right-20 bottom-0 h-24 w-24 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-6">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#0B6CB8] to-[#38BDF8] flex items-center justify-center text-white overflow-hidden shadow-md">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  height={96}
                  width={96}
                />
              ) : (
                <User size={40} />
              )}
            </div>

            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
              <Camera size={24} />
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Profile Picture
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Upload a professional picture. Max size 2MB.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-sm font-semibold text-[#0B6CB8] hover:text-[#0F4C81] transition-colors"
            >
              Choose new image
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            icon={<User size={18} />}
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <InputField
            label="Email Address"
            icon={<Mail size={18} />}
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            label="Phone Number"
            icon={<Phone size={18} />}
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <InputField
            label="Current Hospital / Clinic"
            icon={<Building2 size={18} />}
            name="worksAt"
            value={form.worksAt}
            onChange={handleChange}
            placeholder="e.g. City General Hospital"
          />
          <InputField
            label="Consultation Fees"
            icon={<IndianRupeeIcon size={18} />}
            name="fees"
            value={form.fees}
            onChange={handleChange}
            type="number"
          />
          <DropdownField
            label="Specialization"
            icon={<User size={18} />}
            options={Object.values(DoctorSpecialization)
              .filter((spec) => spec.toString().length > 3)
              .map((spec) => ({
                value: spec.toString(),
                label: spec.toString(),
              }))}
            props={{
              name: "specialization",
              value: form.specialization,
              onChange: (e) =>
                setForm({
                  ...form,
                  specialization: e.target
                    .value as unknown as DoctorSpecialization,
                }),
            }}
          />

          <TextAreaField
            label="About"
            icon={<FileText size={18} />}
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="Write a brief professional summary..."
          />

          <ArrayField
            label="Education"
            icon={<GraduationCap size={18} />}
            items={form.education}
            onAdd={() => addArrayItem("education")}
            onChange={(index: number, value: string) =>
              handleArrayChange("education", index, value)
            }
            onRemove={(index: number) => removeArrayItem("education", index)}
            placeholder="e.g. MD, Harvard Medical School"
          />

          <ArrayField
            label="Certifications"
            icon={<Award size={18} />}
            items={form.certifications}
            onAdd={() => addArrayItem("certifications")}
            onChange={(index: number, value: string) =>
              handleArrayChange("certifications", index, value)
            }
            onRemove={(index: number) =>
              removeArrayItem("certifications", index)
            }
            placeholder="e.g. American Board of Internal Medicine"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#0B6CB8] to-[#38BDF8] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleSave}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InputField({ label, icon, ...props }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-2 block">
        {label}
      </label>
      <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 h-12 bg-slate-50/50 focus-within:bg-white focus-within:border-[#0B6CB8] focus-within:ring-4 focus-within:ring-[#0B6CB8]/10 transition-all">
        <div className="text-slate-400">{icon}</div>
        <input
          {...props}
          className="flex-1 outline-none bg-transparent text-slate-900"
        />
      </div>
    </div>
  );
}

function DropdownField({
  label,
  icon,
  options,
  ...props
}: {
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  props?: React.SelectHTMLAttributes<HTMLSelectElement>;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-2 block">
        {label}
      </label>
      <div className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 h-12 bg-slate-50/50 focus-within:bg-white focus-within:border-[#0B6CB8] focus-within:ring-4 focus-within:ring-[#0B6CB8]/10 transition-all">
        <div className="text-slate-400">{icon}</div>
        <select
          {...props}
          className="flex-1 outline-none bg-transparent text-slate-900 cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TextAreaField({ label, icon, ...props }: any) {
  return (
    <div className="col-span-1 md:col-span-2">
      <label className="text-sm font-medium text-slate-700 mb-2 block">
        {label}
      </label>
      <div className="flex gap-3 border border-slate-200 rounded-2xl p-4 bg-slate-50/50 focus-within:bg-white focus-within:border-[#0B6CB8] focus-within:ring-4 focus-within:ring-[#0B6CB8]/10 transition-all">
        <div className="text-slate-400 mt-0.5">{icon}</div>
        <textarea
          {...props}
          className="flex-1 outline-none bg-transparent text-slate-900 min-h-[100px] resize-y"
        />
      </div>
    </div>
  );
}

function ArrayField({
  label,
  icon,
  items,
  onAdd,
  onChange,
  onRemove,
  placeholder,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return (
    <div className="col-span-1 md:col-span-2">
      <label className="text-sm font-medium text-slate-700 mb-2 block">
        {label}
      </label>
      <div className="space-y-3">
        {items.map((item: string, index: number) => (
          <div
            key={index}
            className="flex items-center gap-3 border border-slate-200 rounded-2xl px-4 h-12 bg-slate-50/50 focus-within:bg-white focus-within:border-[#0B6CB8] focus-within:ring-4 focus-within:ring-[#0B6CB8]/10 transition-all"
          >
            <div className="text-slate-400">{icon}</div>
            <input
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 outline-none bg-transparent text-slate-900"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
            >
              <X size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 text-sm font-semibold text-[#0B6CB8] hover:text-[#0F4C81] transition-colors py-2 px-1"
        >
          <Plus size={16} /> Add {label}
        </button>
      </div>
    </div>
  );
}
