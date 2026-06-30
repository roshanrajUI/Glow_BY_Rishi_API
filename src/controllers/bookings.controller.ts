import { Get, Query, Route, Tags } from "tsoa";
import { Service } from "typedi";
import BookingService from "../services/bookings.services";
import { BookingStatus } from "../models/interfaces/booking.interfaces";
import Booking from "../models/entities/bookings.entity";

@Route("api/bookings")
@Service()
@Tags("Bookings")
export default class BookingsContoller {
  constructor(private readonly bookingService: BookingService) {}

  @Get("/booking-reviews")
  public async getBookingReviews() {
    return this.bookingService.getBookingReviews();
  }

  @Get("/")
  public async getAllBookingsByStatus(
    @Query() status?: BookingStatus,
  ): Promise<Booking[]> {
    return this.bookingService.getAllBookingsByStatus(status);
  }
}
