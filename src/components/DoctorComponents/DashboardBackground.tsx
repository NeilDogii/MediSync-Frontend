"use client";
import React from "react";
import PatientCard, { samplePatients, getTotalVisits } from "./patient";
import PatientList, { samplePatientList } from "./patientList";
import Calender from "./calender";

export default function DashboardBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      {/* Dashboard Wrapper */}
      <div
        className="ml-64 flex-1 min-h-screen bg-white rounded-l-3xl overflow-y-auto relative"
        style={{
          backgroundColor: "#D2F0F6",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0">
          {/* Content Container */}
          <div className="relative z-10 p-6 sm:p-10">
            {children}

            {/* HEADER */}
            <div className="flex justify-between items-center px-10 max-[750px]:flex-col max-[750px]:items-center gap-4">
              <div className="ml-25">
                {" "}
                {/* shifting right */}
                <h2 className="text-3xl font-bold text-gray-900 max-[750px]:text-2xl">
                  Your Clinical Dashboard
                </h2>
                <p className="text-gray-600 text-sm mt-1 max-[750px]:text-center">
                  Track patients, visits, and upcoming appointments.
                </p>
              </div>
            </div>

            {/* MAIN SECTION */}
            <div className="mt-10 max-[750px]:px-2">
              {/* TODAY'S OVERVIEW – FULL WIDTH */}
              <div className="flex justify-center">
                <div
                  className="relative z-10 bg-white rounded-3xl shadow-xl p-8 w-[815px]
                             max-[1100px]:w-[760px]
                             max-[950px]:w-[680px]
                             max-[750px]:w-full max-[750px]:p-6"
                  style={{
                    backgroundImage: "url('/assets/Background.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Today&apos;s Overview
                  </h2>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-6 text-center max-[750px]:grid-cols-1">
                    <div className="bg-[#E0F7FF] p-5 rounded-xl shadow-sm">
                      <p className="text-gray-600 text-sm">Total Visits</p>
                      <h3 className="text-3xl font-bold text-[#0077B6]">
                        {getTotalVisits()}
                      </h3>
                    </div>

                    <div className="bg-[#E8FFE5] p-5 rounded-xl shadow-sm">
                      <p className="text-gray-600 text-sm">Upcoming Patients</p>
                      <h3 className="text-3xl font-bold text-green-600">
                        {samplePatients.length}
                      </h3>
                    </div>

                    <div className="bg-[#FFF7E5] p-5 rounded-xl shadow-sm">
                      <p className="text-gray-600 text-sm">Pending Reports</p>
                      <h3 className="text-3xl font-bold text-yellow-600">3</h3>
                    </div>
                  </div>

                  {/* Small Cards */}
                  <div className="flex gap-4 mt-8 flex-wrap justify-center">
                    {samplePatients.map((p, i) => (
                      <PatientCard
                        key={i}
                        title={p.title}
                        count={p.count}
                        color={p.color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* PATIENT LIST + CALENDAR SIDE BY SIDE */}
              <div
                className="flex gap-10 mt-10 justify-center
                           max-[950px]:gap-6
                           max-[750px]:flex-col max-[750px]:items-center"
              >
                {/* PATIENT LIST */}
                <div
                  className="bg-white rounded-3xl shadow-md p-6 w-[350px] h-[425px]
                             max-[1100px]:w-[340px]
                             max-[950px]:w-[320px] max-[950px]:h-[380px]
                             max-[750px]:w-full max-[750px]:h-auto"
                >
                  <h2 className="text-lg font-semibold mb-3">Patient List</h2>
                  <div className="max-h-[350px] overflow-y-auto space-y-4 pr-2">
                    <PatientList items={samplePatientList} />
                  </div>
                </div>

                {/* CALENDAR */}
                <div
                  className="flex flex-col items-center justify-center
                             max-[950px]:w-[320px]
                             max-[750px]:w-full mt-0"
                >
                  <Calender />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
