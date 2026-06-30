import Client from "../entities/clients.entity";

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface BookingReviews {
  bookingId: string;
  clientId: string;
  bookingDate: Date;
  location: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  reviewRating?: number;
  reviewText?: string;
  reviewDate?: Date;
  isActive: boolean;
  client: Client;
}
