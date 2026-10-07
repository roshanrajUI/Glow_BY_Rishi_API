import type Client from "./clients.entity";
import type { BookingStatus } from "../interfaces/booking.interfaces";
import type MyBookingServices from "./booking-services.entity";

export default interface Booking {
  bookingId: string;
  bookingNumber: string;
  clientId: string;
  bookingDate: string;
  bookingTime: string;
  location: string;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  reviewRating?: number;
  reviewText?: string;
  reviewDate?: Date | string;
  isOtpVerified: boolean;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  client: Client;
  bookingServices: MyBookingServices[];
}
