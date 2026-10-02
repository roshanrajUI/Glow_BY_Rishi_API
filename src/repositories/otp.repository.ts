import { DataSource } from "typeorm";
import dbConfig from "../config/db.config";
import { Otp } from "../models/entities/otp";
import { ApiError } from "../models/api.error";
import {
  ResendOtp,
  VerifyBooking,
} from "../models/interfaces/booking.interfaces";
import { Service } from "typedi";
import { MailService } from "../services/mail.service";

@Service()
export class OtpRepository {
  constructor(
    private dataSource: DataSource,
    private mailService: MailService,
  ) {}
  otpRepository = dbConfig.getRepository(Otp);

  async createOtp(bookingNumber: string, gmail: string): Promise<string> {
    const otp = {
      bookingNumber,
      gmail,
      otpHash: this.otpGeneration(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };
    const createdOtp = await this.otpRepository.save(otp);
    return createdOtp.otpHash;
  }

  otpGeneration(): string {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }

  async verifyOtp(bookingDetails: VerifyBooking): Promise<boolean> {
    const otpRecord = await this.otpRepository.findOne({
      where: {
        bookingNumber: bookingDetails.bookingNumber,
        gmail: bookingDetails.gmail,
      },
    });

    if (!otpRecord) {
      throw new ApiError(404, "Invalid Details");
    }
    if (new Date() > otpRecord.expiresAt) {
      throw new ApiError(404, "OTP Expired Please try again");
    }
    return otpRecord.otpHash === bookingDetails.otp;
  }

  async resendOtp(bookingDetails: ResendOtp): Promise<Boolean> {
    const { bookingNumber, gmail } = bookingDetails;
    const existingOtp = await this.otpRepository.findOne({
      where: {
        bookingNumber,
        gmail,
      },
    });

    if (!existingOtp) {
      throw new ApiError(409, "Booking Not Found or Booking Already Verified");
    }

    const otp = {
      otpHash: this.otpGeneration(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };
    const result = await this.otpRepository.update(existingOtp.id, otp);
    await this.mailService.verifyBookingMail({
      gmail: gmail,
      bookingNumber: bookingNumber,
      otp: otp.otpHash, // otp with out hashing
    });
    return result.affected === 1;
  }
}
