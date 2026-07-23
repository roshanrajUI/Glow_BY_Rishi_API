import { Service } from "typedi";
import { BookingRepository } from "../repositories/bookings.repository";
import {
  BookedInfo,
  BookingReviews,
  BookingStatus,
  CreateBooking,
} from "../models/interfaces/booking.interfaces";
import Booking from "../models/entities/bookings.entity";

@Service()
export default class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async createBooking(booking: CreateBooking): Promise<BookedInfo> {
    return await this.bookingRepository.createBooking(booking);
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.getAllBookings();
  }

  async getAllBookingsByStatus(status?: BookingStatus): Promise<Booking[]> {
    return await this.bookingRepository.getAllBookingsByStatus(status);
  }

  async getBookingReviews(): Promise<BookingReviews[]> {
    return await this.bookingRepository.getBookingReviews();
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    return await this.bookingRepository.getBookingById(bookingId);
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    return await this.bookingRepository.updateBooking(booking);
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<Booking | null> {
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
}
