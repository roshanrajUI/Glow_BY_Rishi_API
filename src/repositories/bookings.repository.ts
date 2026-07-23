import { Service } from "typedi";
import dbConfig from "../config/db.config";
import Booking from "../models/entities/bookings.entity";
import {
  BookedInfo,
  BookingReviews,
  BookingStatus,
  CreateBooking,
  CreateBookingService,
} from "../models/interfaces/booking.interfaces";
import { ApiError } from "../models/api.erro";
import { DataSource } from "typeorm";
import Client from "../models/entities/clients.entity";
import MyBookingServices from "../models/entities/booking-services.entity";

@Service()
export class BookingRepository {
  constructor(private dataSource: DataSource) {}
  bookingRepository = dbConfig.getRepository(Booking);

  async createBooking(bookingDetails: CreateBooking): Promise<BookedInfo> {
    return await this.dataSource.transaction(async (manager) => {
      const clientRepository = manager.getRepository(Client);
      const bookingRepository = manager.getRepository(Booking);
      const bookingServiceRepository = manager.getRepository(MyBookingServices);
      const {
        clientName,
        phoneNumber,
        location,
        gmail,
        bookingDate,
        bookingTime,
        bookedServices,
        description,
        totalPrice,
      } = bookingDetails;
      const clientDetails = {
        clientName,
        phoneNumber,
        address: location,
        gmail,
      };

      let isClientExists = await clientRepository.findOne({
        where: { phoneNumber },
      });

      if (!isClientExists) {
        isClientExists = clientRepository.create(clientDetails);
        isClientExists = await clientRepository.save(isClientExists);
        if (!isClientExists) {
          throw new ApiError(409, "Please Check Client Details");
        }
      }

      const bookingCount = await bookingRepository.count();
      const booking = bookingRepository.create({
        bookingNumber: `GLOW${String(bookingCount + 14).padStart(4, "0")}`,
        clientId: isClientExists.clientId,
        bookingDate: this.formatMySQLDateTime(bookingDate),
        bookingTime: this.formatMySQLDateTime(bookingTime),
        location: location,
        notes: description,
        status: "Pending",
        totalPrice: totalPrice,
      });

      const createdBooking = await bookingRepository.save(booking);

      const myServices: CreateBookingService[] = bookedServices.map((ser) => {
        const booked = bookingServiceRepository.create({
          ...ser,
          bookingId: createdBooking.bookingId,
        });
        return booked;
      });

      await bookingServiceRepository.save(myServices);
      const { bookingNumber } = booking;
      return {
        bookingNumber,
        bookingDate,
        bookingTime,
      };
    });
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

  formatMySQLDateTime(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  }
}
