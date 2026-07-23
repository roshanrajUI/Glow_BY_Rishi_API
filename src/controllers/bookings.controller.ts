import { Body, Get, Post, Query, Route, Tags } from "tsoa";
import { Service } from "typedi";
import BookingService from "../services/bookings.services";
import {
  BookedInfo,
  BookingReviews,
  BookingStatus,
  CreateBooking,
} from "../models/interfaces/booking.interfaces";
import Booking from "../models/entities/bookings.entity";

@Route("api/bookings")
@Service()
@Tags("Bookings")
export default class BookingsContoller {
  constructor(private readonly bookingService: BookingService) {}

  @Post("/create")
  public async createBooking(
    @Body() booking: CreateBooking,
  ): Promise<BookedInfo> {
    return await this.bookingService.createBooking(booking);
  }

  @Get("/booking-reviews")
  public async getBookingReviews(): Promise<BookingReviews[]> {
    return await this.bookingService.getBookingReviews();
  }

  @Get("/")
  public async getAllBookings(
    @Query() status?: BookingStatus,
  ): Promise<Booking[]> {
    return await this.bookingService.getAllBookingsByStatus(status);
  }

  @Get("/{bookingId}")
  public async getBookingById(bookingId: string): Promise<Booking | null> {
    return await this.bookingService.getBookingById(bookingId);
  }

  @Post("/update")
  public async updateBooking(@Body() booking: Booking): Promise<Booking> {
    return await this.bookingService.updateBooking(booking);
  }

  @Post("/update-status")
  public async updateBookingStatus(
    @Body() booking: { bookingId: string; status: BookingStatus },
  ): Promise<Booking | null> {
    return await this.bookingService.updateBookingStatus(
      booking.bookingId,
      booking.status,
    );
  }

  @Get("/client-bookings/:clientId")
  public async getBookingsByClientId(
    @Query() clientId: string,
  ): Promise<Booking[]> {
    return await this.bookingService.getBookingsByClientId(clientId);
  }

  @Get("/client-bookings/:phoneNumber")
  public async getBookingsByClientPhoneNumber(
    @Query() phoneNumber: string,
  ): Promise<Booking[]> {
    return await this.bookingService.getBookingsByClientPhoneNumber(
      phoneNumber,
    );
  }
}
