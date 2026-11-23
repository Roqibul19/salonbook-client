export type ServiceStatus = "active" | "inactive";

export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: ServiceStatus;
  createdAt: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export interface Appointment {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  message: string;
  servicePrice: number;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  createdAt: string;
  service?: Pick<Service, "_id" | "serviceName" | "image" | "category" | "duration">;
  customer?: { _id: string; name: string; email: string; image?: string | null; phone?: string | null };
}

export interface Transaction {
  _id: string;
  appointmentId: string;
  customerId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
  customer?: { _id: string; name: string; email: string; image?: string | null };
  appointment?: { _id: string; appointmentDate: string; timeSlot: string; serviceName?: string };
}

export interface CategoryCount {
  name: string;
  count: number;
}
