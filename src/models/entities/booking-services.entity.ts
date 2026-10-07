import type Booking from "./bookings.entity";
import type MyService from "./my-services.entity";

export default interface MyBookingServices {
  bookingServiceId: string;
  bookingId: string;
  serviceId: string;
  price: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  booking?: Booking;
  service?: MyService;
}
