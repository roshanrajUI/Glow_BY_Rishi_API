import { Router } from "express";
import Container from "typedi";
import { CategoryController } from "../controllers/category.controller";
import { Validation } from "../middlewares/validation";
import { CreateCategory } from "../joi-schemas/category-create";

const categoryRouter = Router();
const categoryController = Container.get(CategoryController);

categoryRouter.put(
  "/:categoryId",
  Validation.run(CreateCategory.setUp(), "body"),
  async (req, res) => {
    try {
      const categoryId = req.params.categoryId as string;
      const updated = await categoryController.updateCategory(
        categoryId,
        req.body,
      );
      res.status(200).send(updated);
    } catch (error) {
      throw error;
    }
  },
);

categoryRouter.post(
  "/",
  Validation.run(CreateCategory.setUp(), "body"),
  async (req, res) => {
    try {
      const category = await categoryController.createCategory(req.body);
      if (category) {
        res.status(200).json(category);
      }
    } catch (error) {
      throw error;
    }
  },
);

categoryRouter.get("/all", async (req, res) => {
  try {
    const categories = await categoryController.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

categoryRouter.delete("/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await categoryController.deleteCategory(categoryId);
    res.status(200).json(category);
  } catch (error) {
    throw error;
  }
});

export default categoryRouter;
