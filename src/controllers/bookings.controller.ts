import BookingService from "../services/bookings.services";
import {
  BookingReviews,
  BookingStatus,
  ClientBooking,
  CreateBooking,
  CreateBookingReview,
  ResendOtp,
  VerifyBooking,
} from "../models/interfaces/booking.interfaces";
import Booking from "../models/entities/bookings.entity";

export default class BookingsContoller {
  constructor(private readonly bookingService: BookingService) {}

  public async createBooking(booking: CreateBooking): Promise<Booking> {
    return await this.bookingService.createBooking(booking);
  }

  public async getBookingReviews(): Promise<BookingReviews[]> {
    return await this.bookingService.getBookingReviews();
  }

  public async getAllBookingsByStatus(
    status?: BookingStatus,
  ): Promise<Booking[]> {
    return await this.bookingService.getAllBookingsByStatus(status);
  }

  public async getBookingById(bookingId: string): Promise<Booking | null> {
    return await this.bookingService.getBookingById(bookingId);
  }

  public async createBookingReview(
    review: CreateBookingReview,
  ): Promise<Boolean> {
    return await this.bookingService.createBookingReview(review);
  }

  public async updateBooking(booking: Booking): Promise<Booking> {
    return await this.bookingService.updateBooking(booking);
  }

  public async updateBookingStatus(booking: {
    bookingId: string;
    status: BookingStatus;
    reason?: string;
  }): Promise<Boolean> {
    return await this.bookingService.updateBookingStatus(
      booking.bookingId,
      booking.status,
      booking.reason,
    );
  }

  public async getBookingsByClientId(clientId: string): Promise<Booking[]> {
    return await this.bookingService.getBookingsByClientId(clientId);
  }

  public async getClientBooking(
    bookingDetails: ClientBooking,
  ): Promise<Booking[]> {
    return await this.bookingService.getClientBooking(bookingDetails);
  }

  public async getBookingsByClientPhoneNumber(
    phoneNumber: string,
  ): Promise<Booking[]> {
    return await this.bookingService.getBookingsByClientPhoneNumber(
      phoneNumber,
    );
  }

  public async verifyBooking(
    bookingDetails: VerifyBooking,
  ): Promise<Boolean> {
    return await this.bookingService.verifyBooking(bookingDetails);
  }

  public async resendOtp(bookingDetails: ResendOtp): Promise<Boolean> {
    return this.bookingService.resendOtp(bookingDetails);
  }
}
