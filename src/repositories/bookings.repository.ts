import { Service } from "typedi";
import dbConfig from "../config/db.config";
import Booking from "../models/entities/bookings.entity";
import {
  BookingReviews,
  BookingStatus,
} from "../models/interfaces/booking.interfaces";

@Service()
export class BookingRepository {
  constructor() {}
  bookingRepository = dbConfig.getRepository(Booking);

  getAllBookingsByStatus(status?: BookingStatus): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: status ? { isActive: true, status } : { isActive: true },
      relations: { client: true },
    });
  }

  async getBookingReviews(): Promise<BookingReviews[]> {
    const allBooking = await this.getAllBookingsByStatus("Completed");
    console.log(allBooking);

    const bookingReviews: BookingReviews[] = allBooking
      .filter(
        (booking) =>
          booking.reviewText &&
          booking.reviewRating &&
          booking.reviewRating > 3,
      )
      .map((booking) => {
        const {
          bookingId,
          clientId,
          bookingDate,
          location,
          status,
          notes,
          reviewDate,
          reviewRating,
          reviewText,
          isActive,
          client,
        } = booking;

        return {
          bookingId,
          clientId,
          bookingDate,
          location,
          status,
          notes,
          reviewDate,
          reviewRating,
          reviewText,
          isActive,
          client,
        };
      });
    return bookingReviews;
  }
}
