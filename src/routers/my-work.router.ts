import { Hono } from "hono";
import { AppBindings } from "../types";
import MyWorkController from "../controllers/my-work.controller";
import MyWorkService from "../services/my-work.service";
import { MyWorkRepository } from "../repositories/my-works.repository";
import { Validation } from "../middlewares/validation";
import { CreateMyWork } from "../models/joi-schemas/work-create";
import { extractFile } from "../lib/image-upload";

const myWorkRouter = new Hono<{ Bindings: AppBindings }>();

function getController(env: AppBindings): MyWorkController {
  const repo = new MyWorkRepository(env.DB, env.UPLOADS);
  const service = new MyWorkService(repo);
  return new MyWorkController(service);
}

myWorkRouter.post("/all", async (c) => {
  const body = await c.req.json();
  const { categoryId, serviceId, pageSize, pageNumber } = body;

  const reqBody = {
    serviceId,
    categoryId,
    pageSize: pageSize || 10,
    pageNumber: pageNumber || 1,
  };
  const result = await getController(c.env).getMyWorks(reqBody);
  return c.json(result, 200);
});

myWorkRouter.post("/", async (c) => {
  const form = await c.req.formData();
  const imageUrl = extractFile(form, "imageUrl", false);
  if (!imageUrl) {
    return c.json({ message: "Service image is required" }, 400);
  }

  const serviceId = form.get("serviceId") as string;
  const title = form.get("title") as string;
  const description = form.get("description") as string;

  Validation.validate(CreateMyWork.setUp(), { serviceId, title, description });

  const myWork = await getController(c.env).createMyWork(
    serviceId,
    title,
    description,
    imageUrl,
  );
  if (myWork) {
    return c.json(myWork, 200);
  }
  return c.body(null, 200);
});

myWorkRouter.put("/:myWorkId", async (c) => {
  const myWorkId = c.req.param("myWorkId");
  const form = await c.req.formData();
  const imageUrl = extractFile(form, "imageUrl", false);

  const serviceId = form.get("serviceId") as string;
  const title = form.get("title") as string;
  const description = form.get("description") as string;

  Validation.validate(CreateMyWork.setUp(), { serviceId, title, description });

  const updated = await getController(c.env).updatemyWork(
    myWorkId,
    serviceId,
    title,
    description,
    imageUrl,
  );
  return c.json(updated, 200);
});

myWorkRouter.get("/all", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const result = await getController(c.env).getMyWorks(body);
  return c.json(result, 200);
});

myWorkRouter.delete("/:myWorkId", async (c) => {
  const myWorkId = c.req.param("myWorkId");
  const myWork = await getController(c.env).deleteMyWork(myWorkId);
  return c.json(myWork, 200);
});

export default myWorkRouter;
