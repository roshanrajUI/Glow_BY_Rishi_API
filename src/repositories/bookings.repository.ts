import { Service } from "typedi";
import dbConfig from "../config/db.config";
import Booking from "../models/entities/bookings.entity";
import {
  BookingReviews,
  BookingStatus,
} from "../models/interfaces/booking.interfaces";
import { ApiError } from "../models/api.erro";

@Service()
export class BookingRepository {
  constructor() {}
  bookingRepository = dbConfig.getRepository(Booking);

  async createBooking(booking: Booking): Promise<Booking> {
    return await this.bookingRepository.save(booking);
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { isActive: true },
      relations: { client: true },
    });
  }

  async getAllBookingsByStatus(status?: BookingStatus): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: status ? { isActive: true, status } : { isActive: true },
      relations: { client: true, bookingServices: true },
    });
  }

  async getBookingReviews(): Promise<BookingReviews[]> {
    const allBooking = await this.getAllBookingsByStatus("Completed");

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
          bookingServices,
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
          bookingServices,
        };
      });
    return bookingReviews;
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const selectedBooking = await this.bookingRepository.findOne({
      where: { bookingId, isActive: true },
      relations: { client: true },
    });
    return selectedBooking;
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    return this.bookingRepository.save(booking);
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<Booking | null> {
    const bookingToUpdate = await this.getBookingById(bookingId);
    if (!bookingToUpdate) {
      throw new ApiError(404, "Booking Not Found");
    }
    bookingToUpdate.status = status;
    return this.bookingRepository.save(bookingToUpdate);
  }

  async deleteBooking(bookingId: string): Promise<void> {
    const bookingToDelete = await this.getBookingById(bookingId);
    if (bookingToDelete) {
      bookingToDelete.isActive = false;
      await this.bookingRepository.save(bookingToDelete);
    }
  }

  async getBookingsByClientNumber(phoneNumber?: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { isActive: true, client: { phoneNumber } },
      relations: { client: true },
    });
  }

  async getBookingsByClientId(clientId?: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { isActive: true, client: { clientId } },
      relations: { client: true },
    });
  }
}
