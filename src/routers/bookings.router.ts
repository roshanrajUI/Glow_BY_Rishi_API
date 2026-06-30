import { Router } from "express";
import Container from "typedi";
import BookingsContoller from "../controllers/bookings.controller";
import { BookingStatus } from "../models/interfaces/booking.interfaces";

const bookingRouter = Router();
const bookingController = Container.get(BookingsContoller);

bookingRouter.get("/booking-reviews", async (req, res) => {
  try {
    const result = await bookingController.getBookingReviews();
    res.status(200).send(result);
  } catch (error) {
    console.log("Error Fetching Booking Reviews", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

bookingRouter.get("/", async (req, res) => {
  try {
    const status: BookingStatus | undefined =
      (req.query.status as BookingStatus) || undefined;
    const result = await bookingController.getAllBookingsByStatus(status);
    res.status(200).send(result);
  } catch (error) {
    console.log("Error Fetching Booking", error);
    res.status(500).send({ messsage: "Internal server error" });
  }
});

export default bookingRouter;
