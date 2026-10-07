import { CreateBookingService } from "../models/interfaces/booking.interfaces";
import { execute, newId, nowIso } from "../lib/db";

export default class BookingServiceRepository {
  constructor(private readonly db: D1Database) {}

  async createBookingService(services: CreateBookingService[]): Promise<boolean> {
    const now = nowIso();
    for (const service of services) {
      await execute(
        this.db,
        `INSERT INTO booking_services (booking_service_id, booking_id, service_id, price, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`,
        [newId(), service.bookingId, service.serviceId, service.price, now, now],
      );
    }
    return services.length > 0;
  }
}
