import { Router } from "express";
import Container from "typedi";
import { CategoryController } from "../controllers/category.controller";
import { Validation } from "../middlewares/validation";
import { CreateCategory } from "../models/joi-schemas/category-create";
import { imageUpload } from "../middlewares/image-upload";
import { UpdateCategory } from "../models/joi-schemas/category-update";

const categoryRouter = Router();
const categoryController = Container.get(CategoryController);

categoryRouter.put(
  "/:categoryId",
  imageUpload("categories").single("imageUrl"),
  Validation.run(UpdateCategory.setUp(), "body"),
  async (req, res) => {
    try {
      const categoryId = req.params.categoryId as string;
      const { categoryName, description } = req.body;
      const updated = await categoryController.updateCategory(
        categoryId,
        categoryName,
        description,
        req.file,
      );
      res.status(200).send(updated);
    } catch (error) {
      throw error;
    }
  },
);

categoryRouter.post(
  "/",
  imageUpload("categories").single("imageUrl"),
  Validation.run(CreateCategory.setUp(), "body"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Category image is required" });
      }
      const { categoryName, description } = req.body;
      const category = await categoryController.createCategory(
        categoryName,
        description,
        req.file,
      );
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
    throw error;
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
