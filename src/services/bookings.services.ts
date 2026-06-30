import { Service } from "typedi";
import { BookingRepository } from "../repositories/bookings.repository";
import {
  BookingReviews,
  BookingStatus,
} from "../models/interfaces/booking.interfaces";
import Booking from "../models/entities/bookings.entity";

@Service()
export default class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  getAllBookingsByStatus(status?: BookingStatus): Promise<Booking[]> {
    return this.bookingRepository.getAllBookingsByStatus(status);
  }

  getBookingReviews(): Promise<BookingReviews[]> {
    return this.bookingRepository.getBookingReviews();
  }
}
