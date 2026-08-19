import nodemailer from "nodemailer";
import { Service } from "typedi";
import { ApiError } from "../models/api.erro";
import { VerifyBooking } from "../models/interfaces/booking.interfaces";

@Service()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "roshan.freelancer499@gmail.com", // generated ethereal user
        pass: "niygbpuwqxszylkp", // generated ethereal password
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: "roshan.freelancer499@gmail.com", // sender address
      to,
      subject,
      html,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new ApiError(500, "Failed to send email");
    }
  }

  async verifyBookingMail(bookingDetails: VerifyBooking) {
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
