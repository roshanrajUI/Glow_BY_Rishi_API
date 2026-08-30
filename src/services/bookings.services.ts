import { Service } from "typedi";
import { BookingRepository } from "../repositories/bookings.repository";
import {
  BookingReviews,
  BOOKINGSTATUS,
  BookingStatus,
  ClientBooking,
  CreateBooking,
  CreateBookingReview,
  ResendOtp,
  VerifyBooking,
} from "../models/interfaces/booking.interfaces";
import Booking from "../models/entities/bookings.entity";
import { OtpRepository } from "../repositories/otp.repository";
import { ApiError } from "../models/api.error";
import { MailService } from "./mail.service";

@Service()
export default class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private optRepository: OtpRepository,
    private mailService: MailService,
  ) {}

  async createBooking(booking: CreateBooking): Promise<Booking> {
    return await this.bookingRepository.createBooking(booking);
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.getAllBookings();
  }

  async getAllBookingsByStatus(status?: BookingStatus): Promise<Booking[]> {
    const result = await this.bookingRepository.getAllBookingsByStatus(status);
    return result;
  }

  async getBookingReviews(): Promise<BookingReviews[]> {
    return await this.bookingRepository.getBookingReviews();
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    return await this.bookingRepository.getBookingById(bookingId);
  }

  async createBookingReview(
    reviewDetails: CreateBookingReview,
  ): Promise<Boolean> {
    return await this.bookingRepository.createBookingReview(reviewDetails);
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    return await this.bookingRepository.updateBooking(booking);
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<Boolean> {
    return await this.bookingRepository.updateBookingStatus(bookingId, status);
  }

  async getBookingsByClientPhoneNumber(
    phoneNumber: string,
  ): Promise<Booking[]> {
    return await this.bookingRepository.getBookingsByClientNumber(phoneNumber);
  }

  async getBookingsByClientId(clientId: string): Promise<Booking[]> {
    return await this.bookingRepository.getBookingsByClientId(clientId);
  }

  async getClientBooking(bookingDetails: ClientBooking): Promise<Booking[]> {
    return await this.bookingRepository.getClientBooking(bookingDetails);
  }

  async verifyBooking(bookingDetails: VerifyBooking): Promise<Boolean> {
    const booking = await this.bookingRepository.getBookingByBookingNumber(
      bookingDetails.bookingNumber,
    );
    if (!booking) {
      throw new ApiError(404, "Booking Not Found");
    }

    if (booking.status !== BOOKINGSTATUS.OTPPENDING) {
      throw new ApiError(404, "OTP already verified please check status");
    }

    const isOtpVerified = await this.optRepository.verifyOtp(bookingDetails);
    if (!isOtpVerified) {
      throw new ApiError(404, "OTP Invalid Please try again");
    }
    booking.isOtpVerified = true;
    booking.status = "Pending";
    const isBookingDone = await this.updateBooking(booking);
    if (booking.isOtpVerified) {
      this.mailService.bookingSuccessMail(
        isBookingDone.client.clientName,
        bookingDetails.gmail,
        bookingDetails.bookingNumber,
      );
    }
    return isBookingDone.isOtpVerified;
  }

  async resendOtp(bookingDetails: ResendOtp): Promise<Boolean> {
    return await this.optRepository.resendOtp(bookingDetails);
  }
}
