export interface Otp {
  id: string;
  bookingNumber: string;
  gmail: string;
  otpHash: string;
  expiresAt: Date | string;
  createdAt: Date | string;
}
