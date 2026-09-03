import { Router } from "express";
import Container from "typedi";
import ServicesController from "../controllers/my-services.controller";
import { Validation } from "../middlewares/validation";
import { CreateService } from "../models/joi-schemas/service-create";
import { imageUpload } from "../middlewares/image-upload";

const myServicesRouter = Router();
const serviceController = Container.get(ServicesController);

myServicesRouter.post(
  "/",
  imageUpload("services").single("imageUrl"),
  Validation.run(CreateService.setup(), "body"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Service image is required" });
      }
      const { serviceName, price, description, categoryId } = req.body;
      const createdService = await serviceController.createService(
        serviceName,
        price,
        description,
        categoryId,
        req.file,
      );
      if (createdService) {
        res.status(200).json(createdService);
      } else {
        res.status(409).json({
          message: "Failed to Create Service",
        });
      }
    } catch (error) {
      throw error;
    }
  },
);

myServicesRouter.put(
  "/:serviceId",
  imageUpload("services").single("imageUrl"),
  Validation.run(CreateService.setup(), "body"),
  async (req, res) => {
    try {
      const serviceId = req.params.serviceId as string;
      const { serviceName, price, description, categoryId } = req.body;
      const updatedService = await serviceController.updateService(
        serviceId,
        serviceName,
        price,
        description,
        categoryId,
        req.file,
      );

      if (updatedService) {
        res.status(200).json(updatedService);
      } else {
        res.status(409).json({
          message: "Failed to update Service",
        });
      }
    } catch (error) {
      throw error;
    }
  },
);

myServicesRouter.delete("/:serviceId", async (req, res) => {
  try {
    const serviceId = req.params.serviceId as string;
    const deleted = serviceController.deleteService(serviceId);
    if (deleted) {
      res.status(200).json(deleted);
    } else {
      res.status(409).json({
        message: "Failed to delete Service",
      });
    }
  } catch (error) {
    throw error;
  }
});

myServicesRouter.get("/all", async (req, res) => {
  try {
    const services = await serviceController.getAllServices();
    res.status(200).send(services);
  } catch (error) {
    throw error;
  }
});

myServicesRouter.get("/services-by-category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const categoryServices =
      await serviceController.getServicesByCategory(categoryId);

    res.status(200).json(categoryServices);
  } catch (error) {
    throw error;
  }
});

export default myServicesRouter;
