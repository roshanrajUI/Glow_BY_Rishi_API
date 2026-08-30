import { Router } from "express";
import MyWorkController from "../controllers/my-work.controller";
import { Container } from "typedi";
import { Validation } from "../middlewares/validation";
import { CreateMyWork } from "../models/joi-schemas/work-create";

const myWorkRouter = Router();
const myWorkController = Container.get(MyWorkController);

myWorkRouter.post("/all", async (req, res) => {
  try {
    let { myWorkId, serviceId, pageSize, pageNumber } = req.body;

    const reqBody = {
      serviceId,
      myWorkId,
      pageSize: pageSize || 10,
      pageNumber: pageNumber || 1,
    };
    const result = await myWorkController.getMyWorks(reqBody);
    res.status(200).send(result);
  } catch (error) {
    throw error;
  }
});

myWorkRouter.post(
  "/",
  Validation.run(CreateMyWork.setUp(), "body"),
  async (req, res) => {
    try {
      const myWork = await myWorkController.createMyWork(req.body);
      if (myWork) {
        res.status(200).json(myWork);
      }
    } catch (error) {
      throw error;
    }
  },
);

myWorkRouter.put(
  "/:myWorkId",
  Validation.run(CreateMyWork.setUp(), "body"),
  async (req, res) => {
    try {
      const myWorkId = req.params.myWorkId as string;
      const updated = await myWorkController.updatemyWork(myWorkId, req.body);
      res.status(200).send(updated);
    } catch (error) {
      throw error;
    }
  },
);

myWorkRouter.get("/all", async (req, res) => {
  try {
    const categories = await myWorkController.getMyWorks(req.body);
    res.status(200).json(categories);
  } catch (error) {
    throw error;
  }
});

myWorkRouter.delete("/:myWorkId", async (req, res, next) => {
  try {
    const myWorkId = req.params.myWorkId;
    const myWork = await myWorkController.deleteMyWork(myWorkId);
    res.status(200).json(myWork);
  } catch (error) {
    throw error;
  }
});
export default myWorkRouter;
