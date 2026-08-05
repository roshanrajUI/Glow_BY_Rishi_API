import Client from "../entities/clients.entity";

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface BookingReviews {
  bookingId: string;
  clientId: string;
  bookingDate: string;
  location: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  reviewRating?: number;
  reviewText?: string;
  reviewDate?: Date;
  isActive: boolean;
  client: Client;
}

export interface CreateBooking {
  bookedServices: CreateBookingService[];
  bookingDate: string;
  bookingTime: string;
  location: string;
  totalPrice: number;
  clientName: string;
  phoneNumber: string;
  gmail: string;
  notes: string;
}

export interface CreateBookingService {
  bookingId?: string;
  serviceId: string;
  price: number;
}

export interface BookedInfo {
  bookingNumber: string;
  bookingDate: string;
  bookingTime: string;
}

export interface ClientBooking {
  phoneNumber: string;
  bookingNumber?: string;
}
