import { Hono } from "hono";
import { AppBindings } from "../types";
import BookingsContoller from "../controllers/bookings.controller";
import BookingService from "../services/bookings.services";
import { BookingRepository } from "../repositories/bookings.repository";
import { OtpRepository } from "../repositories/otp.repository";
import { MailService } from "../services/mail.service";
import { BookingStatus } from "../models/interfaces/booking.interfaces";
import { Validation } from "../middlewares/validation";
import { CreateReview } from "../models/joi-schemas/review-create";

const bookingRouter = new Hono<{ Bindings: AppBindings }>();

function getController(env: AppBindings): BookingsContoller {
  const mailService = new MailService(env.RESEND_API_KEY);
  const otpRepository = new OtpRepository(env.DB, mailService);
  const bookingRepository = new BookingRepository(env.DB, mailService, otpRepository);
  const bookingService = new BookingService(bookingRepository, otpRepository, mailService);
  return new BookingsContoller(bookingService);
}

bookingRouter.post("/create", async (c) => {
  const body = await c.req.json();
  const booking = await getController(c.env).createBooking(body);
  return c.json(booking, 200);
});

bookingRouter.get("/", async (c) => {
  const status = c.req.query("status") as BookingStatus | undefined;
  const result = await getController(c.env).getAllBookingsByStatus(status);
  return c.json(result, 200);
});

bookingRouter.get("/booking-reviews", async (c) => {
  const result = await getController(c.env).getBookingReviews();
  return c.json(result, 200);
});

bookingRouter.get("/:bookingId", async (c) => {
  const bookingId = c.req.param("bookingId");
  const result = await getController(c.env).getBookingById(bookingId);
  if (result) {
    return c.json(result, 200);
  }
  return c.json({ message: "Booking not found" }, 404);
});

bookingRouter.post("/update", async (c) => {
  const body = await c.req.json();
  const result = await getController(c.env).updateBooking(body);
  return c.json(result, 200);
});

bookingRouter.post("/create-review", async (c) => {
  const body = await c.req.json();
  Validation.validate(CreateReview.setUp(), body);
  const result = await getController(c.env).createBookingReview(body);
  return c.json(result, 200);
});

bookingRouter.post("/update-status", async (c) => {
  const body = await c.req.json();
  const result = await getController(c.env).updateBookingStatus(body);
  if (result) {
    return c.json(result, 200);
  }
  return c.json({ message: "Booking not found" }, 404);
});

bookingRouter.get("/client-bookings/:clientId", async (c) => {
  const clientId = c.req.param("clientId");
  const result = await getController(c.env).getBookingsByClientId(clientId);
  return c.json(result, 200);
});

bookingRouter.get("/client-bookings/by-phonenumber/:phoneNumber", async (c) => {
  const phoneNumber = c.req.param("phoneNumber");
  const result = await getController(c.env).getBookingsByClientPhoneNumber(phoneNumber);
  return c.json(result, 200);
});

bookingRouter.post("/client-bookings", async (c) => {
  const body = await c.req.json();
  const bookings = await getController(c.env).getClientBooking(body);
  return c.json(bookings, 200);
});

bookingRouter.post("/verify-booking", async (c) => {
  const body = await c.req.json();
  const isVerified = await getController(c.env).verifyBooking(body);
  return c.json(isVerified, 200);
});

bookingRouter.post("/resend-otp", async (c) => {
  const body = await c.req.json();
  const resend = await getController(c.env).resendOtp(body);
  return c.json(resend, 200);
});

export default bookingRouter;
