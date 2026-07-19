import { Router } from "express";
import Container from "typedi";
import { CategoryController } from "../controllers/category.controller";

const categoryRouter = Router();
const categoryController = Container.get(CategoryController);

categoryRouter.get("/all", async (req, res) => {
  try {
    const categories = await categoryController.getAllCategories();
    res.status(200).send(categories);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default categoryRouter;
