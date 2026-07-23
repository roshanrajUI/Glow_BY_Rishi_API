import { Service } from "typedi";
import dbConfig from "../config/db.config";
import MyBookingServices from "../models/entities/booking-services.entity";
import { CreateBookingService } from "../models/interfaces/booking.interfaces";

@Service()
export default class BookingServiceRepository {
  private readonly bookingServiceRepository =
    dbConfig.getRepository(MyBookingServices);

  async createBookingService(
    services: CreateBookingService[],
  ): Promise<boolean> {
    const bookingServices = services.map((service) =>
      this.bookingServiceRepository.create(service),
    );

    const created = await this.bookingServiceRepository.save(bookingServices);
    return created.length > 0;
  }
}
