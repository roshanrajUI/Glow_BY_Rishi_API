import { Resend } from "resend";
import { Service } from "typedi";
import { ApiError } from "../models/api.error";
import { VerifyBooking } from "../models/interfaces/booking.interfaces";

@Service()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: "onboarding@resend.dev",
        to: "roshanraj.ui499@gmail.com",
        subject,
        html,
      });

      if (error) {
        console.error("Error sending email:", error);
        throw new ApiError(500, "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to send email");
    }
  }

  async verifyBookingMail(bookingDetails: VerifyBooking): Promise<void> {
    await this.sendMail(
      bookingDetails.gmail,
      "Booking OTP Verification",
      `<p>Please enter below OTP</p>
        <h1>${bookingDetails.otp}</h1>
      `,
    );
  }

  async bookingSuccessMail(
    clientName: string,
    clientEmail: string,
    bookingNumber: string,
  ): Promise<void> {
    await this.sendMail(
      clientEmail,
      "Booking Confirmation",
      `<p>Dear ${clientName},</p>
        <p>Thank you for booking with us! Your booking <b>${bookingNumber}</b> has been successfully Booked.</p>
        <p>We look forward to serving you.</p>
        <p>Best regards,<br/>Glow By Rishi Team</p>`,
    );
  }
}
