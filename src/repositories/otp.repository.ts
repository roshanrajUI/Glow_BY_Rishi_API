import { Otp } from "../models/entities/otp";
import { ApiError } from "../models/api.error";
import {
  ResendOtp,
  VerifyBooking,
} from "../models/interfaces/booking.interfaces";
import { MailService } from "../services/mail.service";
import { execute, fetchOne, newId, nowIso } from "../lib/db";

interface OtpRow {
  id: string;
  booking_number: string;
  gmail: string;
  otp_hash: string;
  expires_at: string;
  created_at: string;
}

function mapOtp(row: OtpRow): Otp {
  return {
    id: row.id,
    bookingNumber: row.booking_number,
    gmail: row.gmail,
    otpHash: row.otp_hash,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export class OtpRepository {
  constructor(
    private readonly db: D1Database,
    private readonly mailService: MailService,
  ) {}

  async createOtp(bookingNumber: string, gmail: string): Promise<string> {
    const otpHash = this.otpGeneration();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await execute(
      this.db,
      `INSERT INTO otp (id, booking_number, gmail, otp_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [newId(), bookingNumber, gmail, otpHash, expiresAt, nowIso()],
    );

    return otpHash;
  }

  otpGeneration(): string {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }

  async verifyOtp(bookingDetails: VerifyBooking): Promise<boolean> {
    const otpRecord = await fetchOne<OtpRow>(
      this.db,
      "SELECT * FROM otp WHERE booking_number = ? AND gmail = ?",
      [bookingDetails.bookingNumber, bookingDetails.gmail],
    );

    if (!otpRecord) {
      throw new ApiError(404, "Invalid Details");
    }
    if (new Date() > new Date(otpRecord.expires_at)) {
      throw new ApiError(404, "OTP Expired Please try again");
    }
    return otpRecord.otp_hash === bookingDetails.otp;
  }

  async resendOtp(bookingDetails: ResendOtp): Promise<Boolean> {
    const { bookingNumber, gmail } = bookingDetails;
    const existingOtp = await fetchOne<OtpRow>(
      this.db,
      "SELECT * FROM otp WHERE booking_number = ? AND gmail = ?",
      [bookingNumber, gmail],
    );

    if (!existingOtp) {
      throw new ApiError(409, "Booking Not Found or Booking Already Verified");
    }

    const otpHash = this.otpGeneration();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const result = await execute(this.db, "UPDATE otp SET otp_hash = ?, expires_at = ? WHERE id = ?", [
      otpHash,
      expiresAt,
      existingOtp.id,
    ]);

    await this.mailService.verifyBookingMail({
      gmail,
      bookingNumber,
      otp: otpHash,
    });

    return result.meta.changes === 1;
  }
}
