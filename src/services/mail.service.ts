import { Resend } from "resend";
import { ApiError } from "../models/api.error";
import { VerifyBooking } from "../models/interfaces/booking.interfaces";
import Booking from "../models/entities/bookings.entity";

const DEFAULT_FROM = "Glow By Rishi <booking@glowbyrishi.in>";
const DEFAULT_REPLY_TO = "glowbyrishitha@gmail.com";

// Palette mirrors the website theme
const THEME = {
  bg: "#faf7f2",
  card: "#f7e6db",
  primary: "#d08374",
  text: "#735f54",
  heading: "#42352f",
  border: "#e5d2cc",
};

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function layout(title: string, content: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:${THEME.bg};font-family:Poppins,Arial,sans-serif;color:${THEME.text};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${THEME.bg};padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${THEME.border};border-radius:12px;overflow:hidden;">
          <tr><td style="background:${THEME.card};padding:28px 24px;text-align:center;border-bottom:3px solid ${THEME.primary};">
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;color:${THEME.heading};letter-spacing:2px;">Glow By Rishi</div>
            <div style="font-size:12px;color:${THEME.primary};letter-spacing:3px;text-transform:uppercase;margin-top:4px;">${escapeHtml(title)}</div>
          </td></tr>
          <tr><td style="padding:28px 24px;font-size:14px;line-height:1.7;color:${THEME.text};">${content}</td></tr>
          <tr><td style="background:${THEME.heading};padding:16px 24px;text-align:center;font-size:12px;color:${THEME.bg};">
            Glow By Rishi &bull; glowbyrishi.in
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

const detailRow = (label: string, value: unknown): string =>
  `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid ${THEME.border};color:${THEME.text};width:35%;">${label}</td>
    <td style="padding:8px 12px;border-bottom:1px solid ${THEME.border};color:${THEME.heading};font-weight:600;">${escapeHtml(value)}</td>
  </tr>`;

export class MailService {
  private resend: Resend;
  private fromAddress: string;
  private replyTo: string;

  private adminEmail: string;

  constructor(
    apiKey: string,
    adminEmail: string = DEFAULT_REPLY_TO,
    fromAddress: string = DEFAULT_FROM,
    replyTo: string = DEFAULT_REPLY_TO,
  ) {
    this.resend = new Resend(apiKey);
    this.adminEmail = adminEmail || DEFAULT_REPLY_TO;
    this.fromAddress = fromAddress;
    this.replyTo = replyTo;
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromAddress,
        to,
        replyTo: this.replyTo,
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
      layout(
        "Verify Your Booking",
        `<p>Please enter the OTP below to verify your booking.</p>
         <div style="text-align:center;margin:24px 0;">
           <span style="display:inline-block;background:${THEME.card};color:${THEME.primary};font-size:32px;font-weight:700;letter-spacing:8px;padding:12px 28px;border-radius:8px;">${escapeHtml(bookingDetails.otp)}</span>
         </div>`,
      ),
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
      layout(
        "Booking Confirmation",
        `<p>Dear ${escapeHtml(clientName)},</p>
         <p>Thank you for booking with us! Your booking <b>${escapeHtml(bookingNumber)}</b> has been successfully booked.</p>
         <p>We look forward to serving you.</p>
         <p>Best regards,<br/>Glow By Rishi Team</p>`,
      ),
    );
  }

  // Sent to the admin only, once a customer has completed a booking
  async adminNewBookingMail(booking: Booking): Promise<void> {
    const { client } = booking;
    const services = booking.bookingServices ?? [];
    const serviceRows = services
      .map(
        (s) => `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid ${THEME.border};color:${THEME.heading};">${escapeHtml(s.service?.serviceName ?? "Service")}</td>
          <td style="padding:8px 12px;border-bottom:1px solid ${THEME.border};color:${THEME.heading};text-align:right;">&#8377;${escapeHtml(s.price)}</td>
        </tr>`,
      )
      .join("");

    const sectionTitle = (text: string) =>
      `<h3 style="font-family:'Cormorant Garamond',Georgia,serif;color:${THEME.heading};font-size:20px;margin:24px 0 8px;border-left:4px solid ${THEME.primary};padding-left:10px;">${text}</h3>`;

    await this.sendMail(
      this.adminEmail,
      `New Booking ${booking.bookingNumber} - ${client.clientName}`,
      layout(
        "New Booking Received",
        `<p>A new booking <b>${escapeHtml(booking.bookingNumber)}</b> has just been made.</p>
         ${sectionTitle("Customer Details")}
         <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${THEME.border};border-radius:8px;">
           ${detailRow("Name", client.clientName)}
           ${detailRow("Phone", client.phoneNumber)}
           ${detailRow("Email", client.gmail)}
         </table>
         ${sectionTitle("Booking Details")}
         <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${THEME.border};border-radius:8px;">
           ${detailRow("Booking No.", booking.bookingNumber)}
           ${detailRow("Date", booking.bookingDate)}
           ${detailRow("Time", booking.bookingTime)}
           ${detailRow("Location", booking.location)}
           ${detailRow("Notes", booking.notes || "-")}
         </table>
         ${sectionTitle("Booked Services")}
         <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${THEME.border};border-radius:8px;">
           ${serviceRows}
           <tr>
             <td style="padding:12px;background:${THEME.card};color:${THEME.heading};font-weight:700;">Total</td>
             <td style="padding:12px;background:${THEME.card};color:${THEME.primary};font-weight:700;text-align:right;">&#8377;${escapeHtml(booking.totalPrice)}</td>
           </tr>
         </table>`,
      ),
    );
  }

  async bookingCancel(
    bookingNumber: string,
    clientName: string,
    clientEmail: string,
    reason: string,
  ) {
    await this.sendMail(
      clientEmail,
      "Booking Cancelation",
      layout(
        "Booking Cancelled",
        `<p>Dear ${escapeHtml(clientName)},</p>
         <p>We are sorry to inform you that your booking #${escapeHtml(bookingNumber)} has been <b>Cancelled</b> due to ${escapeHtml(reason)}.</p>
         <p>We apologize for any inconvenience caused and appreciate your understanding.</p>`,
      ),
    );
  }

  async bookingCompleted(
    bookingNumber: string,
    clientName: string,
    clientEmail: string,
  ) {
    await this.sendMail(
      clientEmail,
      "Booking Completed",
      layout(
        "Booking Completed",
        `<p>Dear ${escapeHtml(clientName)},</p>
         <p>We are happy to inform you that your booking #${escapeHtml(bookingNumber)} has been <b>Completed</b> successfully.</p>
         <p>We appreciate your feedback. Please <a href="" style="color:${THEME.primary};">add a review and rating</a>.</p>`,
      ),
    );
  }

  async bookingConfirmed(
    bookingNumber: string,
    clientName: string,
    clientEmail: string,
  ) {
    await this.sendMail(
      clientEmail,
      "Booking Confirmed",
      layout(
        "Booking Confirmed",
        `<p>Dear ${escapeHtml(clientName)},</p>
         <p>We are happy to inform you that your booking #${escapeHtml(bookingNumber)} has been <b>Confirmed</b> successfully.</p>`,
      ),
    );
  }
}
