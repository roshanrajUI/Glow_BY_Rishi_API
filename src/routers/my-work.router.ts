import { Router } from "express";
import MyWorkController from "../controllers/my-work.controller";
import { Container } from "typedi";

const myWorkRouter = Router();
const myWorkController = Container.get(MyWorkController);

myWorkRouter.post("/", async (req, res) => {
  try {
    let { categoryId, serviceId, pageSize, pageNumber } = req.body;

    const reqBody = {
      serviceId,
      categoryId,
      pageSize: pageSize || 10,
      pageNumber: pageNumber || 1,
    };
    const result = await myWorkController.getMyWorks(reqBody);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching my works:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
export default myWorkRouter;
