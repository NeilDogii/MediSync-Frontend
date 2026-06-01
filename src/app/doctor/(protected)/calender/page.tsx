"use client";

import React, { useState, useEffect } from "react";
import { DateSelectArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Sidebar from "@/components/DoctorComponents/SidebarDoctor";
import { Appointment } from "@/@types/appointment";
import { fetchDoctorAppointments } from "@/utils/requests/appointment/appointments";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  backgroundColor: string;
  borderColor: string;
}

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<CalendarEvent[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const extractDoctorIdFromToken = (token: string): number | null => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Invalid JWT token format");
        return null;
      }
      const payload = JSON.parse(atob(parts[1]));
      return payload.id || payload.doctorId || null;
    } catch (error) {
      console.error("Error extracting doctor ID from token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("__doctor_token__");
    if (token) {
      const id = extractDoctorIdFromToken(token);
      if (id) {
        setDoctorId(id);
      }
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      const loadAppointments = async () => {
        setLoading(true);
        const data = await fetchDoctorAppointments({ doctorId });
        setAppointments(data);

        // Convert appointments to calendar events
        const events = data.map((appointment) => ({
          id: appointment.id.toString(),
          title: `${appointment.patient?.name || "Patient"} - ${
            appointment.condition
          }`,
          start: appointment.date,
          backgroundColor: getEventColor(appointment.status),
          borderColor: getEventColor(appointment.status),
        }));

        setCurrentEvents(events);
        setLoading(false);
      };
      loadAppointments();
    }
  }, [doctorId]);

  const getEventColor = (status: string): string => {
    switch (status) {
      case "SCHEDULED":
        return "#0077B6";
      case "COMPLETED":
        return "#10B981";
      case "CANCELLED":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
        backgroundColor: "#6B7280",
      };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0077B6]"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex flex-col md:flex-row w-full px-4 md:px-10 gap-6 md:gap-8 py-6">
          {/* Left Section - Appointments List */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-2xl shadow-md border border-[#0093D6]/30">
            <div className="py-6 text-xl md:text-2xl font-extrabold px-5 text-[#005FA3] border-b-2 border-[#0093D6]">
              Appointments
            </div>
            <ul className="space-y-3 p-4 overflow-y-auto max-h-[70vh]">
              {appointments.length <= 0 && (
                <div className="italic text-center text-gray-400">
                  No Appointments Scheduled
                </div>
              )}

              {appointments.length > 0 &&
                appointments.map((appointment: Appointment) => (
                  <li
                    key={appointment.id}
                    className="border border-[#0093D6]/50 shadow-sm px-3 py-2 rounded-md text-[#005FA3] hover:bg-[#0093D6]/10 transition"
                  >
                    <div className="text-sm font-semibold">
                      {appointment.patient?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {appointment.condition}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(appointment.date).toLocaleDateString("en-IN")}
                    </div>
                    <div
                      className={`text-xs font-semibold mt-1 ${
                        appointment.status === "SCHEDULED"
                          ? "text-blue-600"
                          : appointment.status === "COMPLETED"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {appointment.status}
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {/* Right Section - Calendar */}
          <div className="w-full md:w-2/3 lg:w-3/4 border-2 rounded-2xl shadow-lg bg-white p-3 md:p-5">
            <FullCalendar
              height={"80vh"}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              initialView="dayGridMonth"
              editable={false}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              initialEvents={currentEvents}
              eventColor="#005FA3"
              eventTextColor="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Dialog for adding new events */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#005FA3] font-bold">
              Add New Event Details
            </DialogTitle>
          </DialogHeader>
          <form className="space-x-5 mb-4" onSubmit={handleAddEvent}>
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              required
              className="border border-[#0093D6] p-3 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-[#005FA3]"
            />
            <button
              className="bg-[#005FA3] hover:bg-[#0093D6] text-white p-3 mt-5 rounded-md font-semibold transition"
              type="submit"
            >
              Add
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
