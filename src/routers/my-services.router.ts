import { Hono } from "hono";
import { AppBindings } from "../types";
import ServicesController from "../controllers/my-services.controller";
import ServicesService from "../services/my-services.service";
import ServicesRepository from "../repositories/my-services.repository";
import { Validation } from "../middlewares/validation";
import { CreateService } from "../models/joi-schemas/service-create";
import { UpdateService } from "../models/joi-schemas/service-update";
import { extractFile } from "../lib/image-upload";

const myServicesRouter = new Hono<{ Bindings: AppBindings }>();

function getController(env: AppBindings): ServicesController {
  const repo = new ServicesRepository(env.DB, env.UPLOADS);
  const service = new ServicesService(repo);
  return new ServicesController(service);
}

myServicesRouter.post("/", async (c) => {
  const form = await c.req.formData();
  const imageUrl = extractFile(form, "imageUrl", false);
  if (!imageUrl) {
    return c.json({ message: "Service image is required" }, 400);
  }

  const serviceName = form.get("serviceName") as string;
  const price = Number(form.get("price"));
  const description = form.get("description") as string;
  const categoryId = form.get("categoryId") as string;

  Validation.validate(CreateService.setup(), {
    serviceName,
    price,
    description,
    categoryId,
  });

  const createdService = await getController(c.env).createService(
    serviceName,
    price,
    description,
    categoryId,
    imageUrl,
  );

  if (createdService) {
    return c.json(createdService, 200);
  }
  return c.json({ message: "Failed to Create Service" }, 409);
});

myServicesRouter.put("/:serviceId", async (c) => {
  const serviceId = c.req.param("serviceId");
  const form = await c.req.formData();
  const imageUrl = extractFile(form, "imageUrl", false);

  const serviceName = form.get("serviceName") as string;
  const price = Number(form.get("price"));
  const description = form.get("description") as string;
  const categoryId = form.get("categoryId") as string;

  Validation.validate(UpdateService.setup(), {
    serviceName,
    price,
    description,
    categoryId,
  });

  const updatedService = await getController(c.env).updateService(
    serviceId,
    serviceName,
    price,
    description,
    categoryId,
    imageUrl,
  );

  if (updatedService) {
    return c.json(updatedService, 200);
  }
  return c.json({ message: "Failed to update Service" }, 409);
});

myServicesRouter.delete("/:serviceId", async (c) => {
  const serviceId = c.req.param("serviceId");
  const deleted = await getController(c.env).deleteService(serviceId);
  if (deleted) {
    return c.json(deleted, 200);
  }
  return c.json({ message: "Failed to delete Service" }, 409);
});

myServicesRouter.get("/all", async (c) => {
  const services = await getController(c.env).getAllServices();
  return c.json(services, 200);
});

myServicesRouter.get("/services-by-category/:categoryId", async (c) => {
  const categoryId = c.req.param("categoryId");
  const categoryServices = await getController(c.env).getServicesByCategory(
    categoryId,
  );
  return c.json(categoryServices, 200);
});

export default myServicesRouter;
