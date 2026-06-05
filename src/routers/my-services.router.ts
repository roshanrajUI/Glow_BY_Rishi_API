import { Router } from "express";
import Container from "typedi";
import ServicesController from "../controllers/my-services.controller";

const myServicesRouter = Router();
const serviceController = Container.get(ServicesController);

myServicesRouter.get("/all", async (req, res) => {
  try {
    const services = await serviceController.getAllServices();
    res.status(200).send(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default myServicesRouter;
