import { Hono } from "hono";
import { AppBindings } from "../types";
import { CategoryController } from "../controllers/category.controller";
import { CategoryService } from "../services/category.service";
import CategoryRepo from "../repositories/category-repository";
import { Validation } from "../middlewares/validation";
import { CreateCategory } from "../models/joi-schemas/category-create";
import { UpdateCategory } from "../models/joi-schemas/category-update";
import { extractFile } from "../lib/image-upload";

const categoryRouter = new Hono<{ Bindings: AppBindings }>();

function getController(env: AppBindings): CategoryController {
  const repo = new CategoryRepo(env.DB, env.UPLOADS);
  const service = new CategoryService(repo);
  return new CategoryController(service);
}

categoryRouter.put("/:categoryId", async (c) => {
  const categoryId = c.req.param("categoryId");
  const form = await c.req.formData();
  const categoryName = form.get("categoryName") as string;
  const description = (form.get("description") as string) ?? undefined;
  const imageUrl = extractFile(form, "imageUrl", false);

  Validation.validate(UpdateCategory.setUp(), { categoryName, description });

  const updated = await getController(c.env).updateCategory(
    categoryId,
    categoryName,
    description,
    imageUrl,
  );
  return c.json(updated, 200);
});

categoryRouter.post("/", async (c) => {
  const form = await c.req.formData();
  const categoryName = form.get("categoryName") as string;
  const description = form.get("description") as string;
  const imageUrl = extractFile(form, "imageUrl", false);

  if (!imageUrl) {
    return c.json({ message: "Category image is required" }, 400);
  }

  Validation.validate(CreateCategory.setUp(), { categoryName, description });

  const category = await getController(c.env).createCategory(
    categoryName,
    description,
    imageUrl,
  );
  return c.json(category, 200);
});

categoryRouter.get("/all", async (c) => {
  const categories = await getController(c.env).getAllCategories();
  return c.json(categories, 200);
});

categoryRouter.delete("/:categoryId", async (c) => {
  const categoryId = c.req.param("categoryId");
  const category = await getController(c.env).deleteCategory(categoryId);
  return c.json(category, 200);
});

export default categoryRouter;
