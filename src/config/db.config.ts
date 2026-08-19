import { DataSource } from "typeorm";
import User from "../models/entities/users.entity";
import Client from "../models/entities/clients.entity";
import WorkPortfolio from "../models/entities/work-portfolio.entity";
import Booking from "../models/entities/bookings.entity";
import BookingService from "../models/entities/booking-services.entity";
import UserService from "../models/entities/user-services.entity";
import MyService from "../models/entities/my-services.entity";
import Category from "../models/entities/service-category.entity";
import MyBookingServices from "../models/entities/booking-services.entity";
import { Otp } from "../models/entities/otp";

const dbConfig: DataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "admin",
  database: "glow_by_rishi",
  timezone: "+05:30",
  entities: [
    User,
    Category,
    MyService,
    Client,
    WorkPortfolio,
    Booking,
    MyBookingServices,
    UserService,
    Client,
    Otp,
  ],
});

export default dbConfig;
