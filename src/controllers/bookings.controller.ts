import { Body, Get, Post, Query, Route, Tags } from "tsoa";
import { Service } from "typedi";
import BookingService from "../services/bookings.services";
import {
  BookedInfo,
  BookingReviews,
  BookingStatus,
  ClientBooking,
  CreateBooking,
  CreateBookingReview,
  ResendOtp,
  VerifyBooking,
} from "../models/interfaces/booking.interfaces";
import Booking from "../models/entities/bookings.entity";

@Route("api/bookings")
@Service()
@Tags("Bookings")
export default class BookingsContoller {
  constructor(private readonly bookingService: BookingService) {}

  @Post("/create")
  public async createBooking(@Body() booking: CreateBooking): Promise<Booking> {
    return await this.bookingService.createBooking(booking);
  }

  @Get("/booking-reviews")
  public async getBookingReviews(): Promise<BookingReviews[]> {
    return await this.bookingService.getBookingReviews();
  }

  @Get("/")
  public async getAllBookingsByStatus(
    @Query() status?: BookingStatus,
  ): Promise<Booking[]> {
    return await this.bookingService.getAllBookingsByStatus(status);
  }

  @Get("/{bookingId}")
  public async getBookingById(bookingId: string): Promise<Booking | null> {
    return await this.bookingService.getBookingById(bookingId);
  }

  @Post("/create-review")
  public async createBookingReview(
    @Body()
    review: CreateBookingReview,
  ): Promise<Boolean> {
    console.log("review details in controller", review);
    return await this.bookingService.createBookingReview(review);
  }

  @Post("/update")
  public async updateBooking(@Body() booking: Booking): Promise<Booking> {
    return await this.bookingService.updateBooking(booking);
  }

  @Post("/update-status")
  public async updateBookingStatus(
    @Body() booking: { bookingId: string; status: BookingStatus },
  ): Promise<Boolean> {
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

  @Post("/client-bookings")
  public async getClientBooking(
    @Body() bookingDetails: ClientBooking,
  ): Promise<Booking[]> {
    return await this.bookingService.getClientBooking(bookingDetails);
  }

  @Get("/client-bookings/by-phonenumber/:phoneNumber")
  public async getBookingsByClientPhoneNumber(
    @Query() phoneNumber: string,
  ): Promise<Booking[]> {
    return await this.bookingService.getBookingsByClientPhoneNumber(
      phoneNumber,
    );
  }

  @Post("/verify-booking")
  public async verifyBooking(
    @Body() bookingDetails: VerifyBooking,
  ): Promise<Boolean> {
    return await this.bookingService.verifyBooking(bookingDetails);
  }

  @Post("/resend-otp")
  public async resendOtp(@Body() bookingDetails: ResendOtp): Promise<Boolean> {
    return this.bookingService.resendOtp(bookingDetails);
  }
}
