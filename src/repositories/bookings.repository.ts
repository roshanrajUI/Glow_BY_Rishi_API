import Booking from "../models/entities/bookings.entity";
import {
  BookingReviews,
  BOOKINGSTATUS,
  BookingStatus,
  ClientBooking,
  CreateBooking,
  CreateBookingReview,
} from "../models/interfaces/booking.interfaces";
import { ApiError } from "../models/api.error";
import Client from "../models/entities/clients.entity";
import { MailService } from "../services/mail.service";
import { OtpRepository } from "./otp.repository";
import { execute, fetchAll, fetchOne, newId, nowIso, toBool } from "../lib/db";

interface BookingRow {
  booking_id: string;
  booking_number: string;
  client_id: string;
  booking_date: string;
  booking_time: string;
  location: string | null;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  review_rating: number | null;
  review_text: string | null;
  review_date: string | null;
  is_otp_verified: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  client_client_id: string;
  client_client_name: string;
  client_phone_number: string;
  client_gmail: string;
  client_address: string | null;
  client_is_active: number;
  client_created_at: string;
  client_updated_at: string;
}

interface BookingServiceRow {
  booking_service_id: string;
  booking_id: string;
  service_id: string;
  price: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  service_service_name?: string;
  service_image_url?: string;
}

const BOOKING_SELECT = `
  SELECT
    b.*,
    c.client_id AS client_client_id,
    c.client_name AS client_client_name,
    c.phone_number AS client_phone_number,
    c.gmail AS client_gmail,
    c.address AS client_address,
    c.is_active AS client_is_active,
    c.created_at AS client_created_at,
    c.updated_at AS client_updated_at
  FROM bookings b
  JOIN clients c ON c.client_id = b.client_id
`;

function mapClientFromRow(row: BookingRow): Client {
  return {
    clientId: row.client_client_id,
    clientName: row.client_client_name,
    phoneNumber: row.client_phone_number,
    gmail: row.client_gmail,
    address: row.client_address ?? undefined,
    isActive: toBool(row.client_is_active),
    createdAt: row.client_created_at,
    updatedAt: row.client_updated_at,
  };
}

function mapBooking(row: BookingRow): Booking {
  return {
    bookingId: row.booking_id,
    bookingNumber: row.booking_number,
    clientId: row.client_id,
    bookingDate: row.booking_date,
    bookingTime: row.booking_time,
    location: row.location ?? "",
    totalPrice: row.total_price,
    status: row.status,
    notes: row.notes ?? undefined,
    reviewRating: row.review_rating ?? undefined,
    reviewText: row.review_text ?? undefined,
    reviewDate: row.review_date ?? undefined,
    isOtpVerified: toBool(row.is_otp_verified),
    isActive: toBool(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    client: mapClientFromRow(row),
    bookingServices: [],
  };
}

export class BookingRepository {
  constructor(
    private readonly db: D1Database,
    private readonly mailService: MailService,
    private readonly otpRepository: OtpRepository,
  ) {}

  // Status-change notification emails are a side effect; a mail provider
  // failure shouldn't prevent the booking status itself from being updated.
  private async sendStatusMailSafely(send: () => Promise<void>): Promise<void> {
    try {
      await send();
    } catch (err) {
      console.error("Failed to send booking status email:", err);
    }
  }

  private async attachBookingServices(bookings: Booking[]): Promise<Booking[]> {
    if (bookings.length === 0) return bookings;
    const ids = bookings.map((b) => b.bookingId);
    const placeholders = ids.map(() => "?").join(",");
    const rows = await fetchAll<BookingServiceRow>(
      this.db,
      `SELECT bs.*, s.service_name AS service_service_name, s.image_url AS service_image_url
       FROM booking_services bs
       LEFT JOIN services s ON s.service_id = bs.service_id
       WHERE bs.booking_id IN (${placeholders})`,
      ids,
    );

    for (const booking of bookings) {
      booking.bookingServices = rows
        .filter((row) => row.booking_id === booking.bookingId)
        .map((row) => ({
          bookingServiceId: row.booking_service_id,
          bookingId: row.booking_id,
          serviceId: row.service_id,
          price: row.price,
          isActive: toBool(row.is_active),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          service: row.service_service_name
            ? ({ serviceName: row.service_service_name, imageUrl: row.service_image_url } as any)
            : undefined,
        }));
    }

    return bookings;
  }

  async createBooking(bookingDetails: CreateBooking): Promise<Booking> {
    const {
      clientName,
      phoneNumber,
      location,
      gmail,
      bookingDate,
      bookingTime,
      bookedServices,
      notes,
      totalPrice,
    } = bookingDetails;

    let client = await fetchOne<{ client_id: string }>(
      this.db,
      "SELECT client_id FROM clients WHERE phone_number = ?",
      [phoneNumber],
    );

    const now = nowIso();
    if (!client) {
      const clientId = newId();
      await execute(
        this.db,
        `INSERT INTO clients (client_id, client_name, phone_number, gmail, address, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
        [clientId, clientName, phoneNumber, gmail, location, now, now],
      );
      client = { client_id: clientId };
    }

    const countRow = await fetchOne<{ count: number }>(this.db, "SELECT COUNT(*) AS count FROM bookings");
    const bookingNumber = `GLOW${String((countRow?.count ?? 0) + 14).padStart(4, "0")}`;
    const bookingId = newId();

    await execute(
      this.db,
      `INSERT INTO bookings (booking_id, booking_number, client_id, booking_date, booking_time, location, total_price, status, notes, is_otp_verified, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, ?)`,
      [
        bookingId,
        bookingNumber,
        client.client_id,
        bookingDate,
        bookingTime,
        location,
        totalPrice,
        BOOKINGSTATUS.OTPPENDING,
        notes ?? null,
        now,
        now,
      ],
    );

    for (const service of bookedServices) {
      await execute(
        this.db,
        `INSERT INTO booking_services (booking_service_id, booking_id, service_id, price, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`,
        [newId(), bookingId, service.serviceId, service.price, now, now],
      );
    }

    const createdBooking = await this.getBookingById(bookingId);
    try {
      const bookingOtp = await this.otpRepository.createOtp(bookingNumber, gmail);
      await this.mailService.verifyBookingMail({ gmail, bookingNumber, otp: bookingOtp });
    } catch (err) {
      // Booking is already persisted (status: OTP Pending); don't fail the whole
      // request just because the OTP email couldn't be sent (e.g. mail provider
      // misconfigured). The client can use "resend-otp" once mail is fixed.
      console.error("Failed to create/send booking OTP:", err);
    }

    return createdBooking!;
  }

  async getAllBookings(): Promise<Booking[]> {
    const rows = await fetchAll<BookingRow>(
      this.db,
      `${BOOKING_SELECT} WHERE b.is_active = 1 AND b.is_otp_verified = 1`,
    );
    return this.attachBookingServices(rows.map(mapBooking));
  }

  async getAllBookingsByStatus(status?: BookingStatus): Promise<Booking[]> {
    const rows = status
      ? await fetchAll<BookingRow>(
          this.db,
          `${BOOKING_SELECT} WHERE b.is_active = 1 AND b.status = ? ORDER BY b.created_at DESC`,
          [status],
        )
      : await fetchAll<BookingRow>(this.db, `${BOOKING_SELECT} WHERE b.is_active = 1 ORDER BY b.created_at DESC`);

    return this.attachBookingServices(rows.map(mapBooking));
  }

  async getBookingReviews(): Promise<BookingReviews[]> {
    const allBooking = await this.getAllBookingsByStatus(BOOKINGSTATUS.COMPLETED);

    return allBooking
      .filter((booking) => booking.reviewText && booking.reviewRating && booking.reviewRating > 3)
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
          reviewDate: reviewDate as any,
          reviewRating,
          reviewText,
          isActive,
          client,
          bookingServices,
        };
      });
  }

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const row = await fetchOne<BookingRow>(this.db, `${BOOKING_SELECT} WHERE b.booking_id = ? AND b.is_active = 1`, [
      bookingId,
    ]);
    if (!row) return null;
    const [booking] = await this.attachBookingServices([mapBooking(row)]);
    return booking;
  }

  async getBookingByBookingNumber(bookingNumber: string): Promise<Booking | null> {
    const row = await fetchOne<BookingRow>(
      this.db,
      `${BOOKING_SELECT} WHERE b.booking_number = ? AND b.is_active = 1`,
      [bookingNumber],
    );
    if (!row) return null;
    const [booking] = await this.attachBookingServices([mapBooking(row)]);
    return booking;
  }

  async createBookingReview(reviewDetails: CreateBookingReview): Promise<Boolean> {
    const { bookingNumber, clientNumber, rating, review } = reviewDetails;
    const bookingToUpdate = await this.getBookingByBookingNumber(bookingNumber);
    if (!bookingToUpdate) {
      throw new ApiError(404, "Booking Not Found");
    }
    switch (bookingToUpdate.status) {
      case BOOKINGSTATUS.OTPPENDING:
        throw new ApiError(409, "Please Verify the OTP");
      case BOOKINGSTATUS.CANCELLED:
        throw new ApiError(409, "Booking is Cancelled");
      case BOOKINGSTATUS.COMPLETED:
        break;
      default:
        throw new ApiError(409, "Booking is not completed yet");
    }

    if (bookingToUpdate.client.phoneNumber !== clientNumber) {
      throw new ApiError(403, "Client Number does not match the booking");
    }

    const result = await execute(
      this.db,
      "UPDATE bookings SET review_rating = ?, review_text = ?, review_date = ?, updated_at = ? WHERE booking_id = ?",
      [rating, review ?? null, nowIso(), nowIso(), bookingToUpdate.bookingId],
    );
    return result.meta.changes === 1;
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    await execute(
      this.db,
      `UPDATE bookings SET booking_date = ?, booking_time = ?, location = ?, total_price = ?, status = ?, notes = ?,
       is_otp_verified = ?, updated_at = ? WHERE booking_id = ?`,
      [
        booking.bookingDate,
        booking.bookingTime,
        booking.location,
        booking.totalPrice,
        booking.status,
        booking.notes ?? null,
        booking.isOtpVerified ? 1 : 0,
        nowIso(),
        booking.bookingId,
      ],
    );
    return (await this.getBookingById(booking.bookingId))!;
  }

  async updateBookingStatus(bookingId: string, bookingStatus: BookingStatus, reason?: string): Promise<Boolean> {
    const bookingToUpdate = await this.getBookingById(bookingId);
    if (!bookingToUpdate) {
      throw new ApiError(404, "Booking Not Found");
    }
    const {
      bookingNumber,
      client: { clientName, gmail },
      status,
    } = bookingToUpdate;

    if (status === BOOKINGSTATUS.OTPPENDING) {
      throw new ApiError(409, "Please Verify the OTP");
    }
    if (status === BOOKINGSTATUS.COMPLETED) {
      throw new ApiError(409, "Booking Already Completed");
    }
    if (status === BOOKINGSTATUS.CANCELLED) {
      throw new ApiError(409, "Booking Already Cancelled");
    }

    switch (bookingStatus) {
      case "Confirmed":
        await this.sendStatusMailSafely(() => this.mailService.bookingConfirmed(bookingNumber, clientName, gmail));
        break;
      case "Completed":
        await this.sendStatusMailSafely(() => this.mailService.bookingCompleted(bookingNumber, clientName, gmail));
        break;
      case "Cancelled":
        if (!reason) {
          throw new ApiError(409, "Please Fill the Reason");
        }
        await this.sendStatusMailSafely(() =>
          this.mailService.bookingCancel(bookingNumber, clientName, gmail, reason),
        );
        break;
      default:
        throw new ApiError(409, "Invalid Booking Status");
    }

    const result = await execute(this.db, "UPDATE bookings SET status = ?, updated_at = ? WHERE booking_id = ?", [
      bookingStatus,
      nowIso(),
      bookingId,
    ]);
    return result.meta.changes === 1;
  }

  async deleteBooking(bookingId: string): Promise<void> {
    const bookingToDelete = await this.getBookingById(bookingId);
    if (bookingToDelete) {
      await execute(this.db, "UPDATE bookings SET is_active = 0, updated_at = ? WHERE booking_id = ?", [
        nowIso(),
        bookingId,
      ]);
    }
  }

  async getBookingsByClientNumber(phoneNumber?: string): Promise<Booking[]> {
    const rows = await fetchAll<BookingRow>(
      this.db,
      `${BOOKING_SELECT} WHERE b.is_active = 1 AND c.phone_number = ?`,
      [phoneNumber],
    );
    return this.attachBookingServices(rows.map(mapBooking));
  }

  async getBookingsByClientId(clientId?: string): Promise<Booking[]> {
    const rows = await fetchAll<BookingRow>(this.db, `${BOOKING_SELECT} WHERE b.is_active = 1 AND c.client_id = ?`, [
      clientId,
    ]);
    return this.attachBookingServices(rows.map(mapBooking));
  }

  async getClientBooking(bookingDetails: ClientBooking): Promise<Booking[]> {
    const { phoneNumber, bookingNumber } = bookingDetails;
    const rows = bookingNumber
      ? await fetchAll<BookingRow>(this.db, `${BOOKING_SELECT} WHERE c.phone_number = ? AND b.booking_number = ?`, [
          phoneNumber,
          bookingNumber,
        ])
      : await fetchAll<BookingRow>(this.db, `${BOOKING_SELECT} WHERE c.phone_number = ?`, [phoneNumber]);

    if (rows.length === 0) {
      throw new ApiError(409, "No Booking Found for Given Details");
    }
    return this.attachBookingServices(rows.map(mapBooking));
  }
}
