import { Router } from "express";
import Container from "typedi";
import BookingsContoller from "../controllers/bookings.controller";
import { BookingStatus } from "../models/interfaces/booking.interfaces";

const bookingRouter = Router();
const bookingController = Container.get(BookingsContoller);

bookingRouter.post("/", async (req, res) => {
  try {
    const booking = await bookingController.createBooking(req.body);
    res.status(200).json(booking);
  } catch (error) {
    console.log("Error Creating Booking", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

bookingRouter.get("/", async (req, res) => {
  try {
    const status: BookingStatus | undefined = req.query.status as
      | BookingStatus
      | undefined;
    const result = await bookingController.getAllBookingsByStatus(status);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error Fetching Booking", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

bookingRouter.get("/booking-reviews", async (req, res) => {
  try {
    const result = await bookingController.getBookingReviews();
    res.status(200).json(result);
  } catch (error) {
    console.log("Error Fetching Booking Reviews", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

bookingRouter.get("/:bookingId", async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await bookingController.getBookingById(bookingId);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "Booking not found" });
    }
  } catch (error) {
    console.log("Error Fetching Booking", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

bookingRouter.post("/update", async (req, res) => {
  try {
    const result = await bookingController.updateBooking(req.body);
    res.status(200).send(result);
  } catch (error) {
    console.log("Error Updating Booking", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

bookingRouter.post("/update-status", async (req, res, next) => {
  try {
    const result = await bookingController.updateBookingStatus(req.body);
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error Updating Booking Status", error);
    next(error);
  }
});

bookingRouter.get("/client-bookings/:clientId", async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const result = await bookingController.getBookingsByClientId(clientId);
    res.status(200).send(result);
  } catch (error) {
    console.log("Error Fetching Client Bookings", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

bookingRouter.get("/client-bookings/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const result =
      await bookingController.getBookingsByClientPhoneNumber(phoneNumber);
    res.status(200).send(result);
  } catch (error) {
    console.log("Error Fetching Client Bookings", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

bookingRouter.post("/client-bookings", async (req, res) => {
  try {
    const bookings = await bookingController.getClientBooking(req.body);
    res.status(200).send(bookings);
  } catch (error) {
    throw error;
  }
});

export default bookingRouter;
