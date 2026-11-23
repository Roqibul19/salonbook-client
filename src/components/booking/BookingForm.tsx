"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { MAX_DAYS_AHEAD, TIME_SLOTS, addDays, formatDate, todayString } from "@/lib/constants";
import type { Service } from "@/types";

type BookingFormProps = {
  service: Service;
  onCancel: () => void;
};

export default function BookingForm({ service, onCancel }: BookingFormProps) {
  const today = todayString();
  const maxDate = addDays(today, MAX_DAYS_AHEAD);

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // load already booked slots for the chosen date
  useEffect(() => {
    if (!date) return;
    let ignore = false;

    api<string[]>(`/appointments/booked-slots?serviceId=${service._id}&date=${date}`)
      .then((slots) => {
        if (!ignore) setBookedSlots(slots);
      })
      .catch(() => {
        if (!ignore) setBookedSlots([]);
      })
      .finally(() => {
        if (!ignore) setSlotsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [date, service._id]);

  const handleDateChange = (value: string) => {
    setDate(value);
    setTimeSlot("");
    setSlotsLoading(Boolean(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!date) return toast.error("Please select an appointment date");
    if (date < today) return toast.error("Appointment date cannot be in the past");
    if (date > maxDate) return toast.error(`You can book up to ${MAX_DAYS_AHEAD} days in advance`);
    if (!timeSlot) return toast.error("Please select a time slot");

    setSubmitting(true);
    try {
      await api("/appointments", {
        method: "POST",
        auth: true,
        body: { serviceId: service._id, appointmentDate: date, timeSlot, message },
      });
      toast.success("Appointment request submitted! We'll confirm it soon.");
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit your request");
      // refresh slots in case someone else just booked this one
      setSlotsLoading(true);
      api<string[]>(`/appointments/booked-slots?serviceId=${service._id}&date=${date}`)
        .then(setBookedSlots)
        .catch(() => {})
        .finally(() => setSlotsLoading(false));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
        <h3 className="mt-3 text-lg font-semibold text-ink">Request submitted</h3>
        <p className="mt-1 text-sm text-muted">
          {service.serviceName} on {formatDate(date)} at {timeSlot}. Status: <b>Pending</b>. You can pay
          once the salon confirms your appointment.
        </p>
        <Link href="/dashboard/customer/appointments" className="btn-primary mt-5">
          View My Appointments
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-line bg-white p-5" noValidate>
      <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <CalendarCheck className="h-5 w-5 text-brand-600" /> Request an appointment
      </h3>

      <div>
        <label htmlFor="date" className="label">Appointment Date</label>
        <input
          id="date"
          type="date"
          value={date}
          min={today}
          max={maxDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="input"
        />
      </div>

      <div>
        <span className="label">Available Time Slot</span>
        {!date ? (
          <p className="text-sm text-muted">Select a date to see available time slots.</p>
        ) : slotsLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking availability...
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIME_SLOTS.map((slot) => {
              const booked = bookedSlots.includes(slot);
              const selected = timeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={booked}
                  onClick={() => setTimeSlot(slot)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    booked
                      ? "cursor-not-allowed border-line bg-gray-50 text-gray-400 line-through"
                      : selected
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-line text-ink hover:border-brand-300 hover:bg-brand-50"
                  }`}
                  aria-pressed={selected}
                  title={booked ? "Already booked" : undefined}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message" className="label">Additional Message (optional)</label>
        <textarea
          id="message"
          rows={3}
          maxLength={500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Anything we should know? e.g. hair length, allergies, preferences"
          className="input resize-none"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-line px-5 py-3 text-sm font-medium text-ink hover:bg-brand-50 sm:flex-1"
        >
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn-primary sm:flex-[2]">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Submitting request..." : `Request Appointment · $${service.price}`}
        </button>
      </div>
    </form>
  );
}
