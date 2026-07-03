import { Router, Request, Response } from "express";
import Container from "typedi";
import { ClientController } from "../controllers/client.controller";

const clientRouter = Router();
const clientController = Container.get(ClientController);

clientRouter.post("/", async (req: Request, res: Response) => {
  try {
    const client = await clientController.createClient(req.body);
    res.status(201).send(client);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).send({ error: "Failed to create client" });
  }
});

clientRouter.get("/", async (req: Request, res: Response) => {
  try {
    const clients = await clientController.getAllClients();
    res.status(200).send(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).send({ error: "Failed to fetch clients" });
  }
});

clientRouter.get(
  "/:phoneNumber",
  async (req: Request<{ phoneNumber: string }>, res: Response) => {
    try {
      const client = await clientController.getClientByNumber(
        req.params.phoneNumber,
      );
      if (client) {
        res.status(200).send(client);
      } else {
        res.status(404).send({ error: "Client not found" });
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).send({ error: "Failed to fetch client" });
    }
  },
);

clientRouter.post(
  "/delete/:phoneNumber",
  async (req: Request<{ phoneNumber: string }>, res: Response) => {
    try {
      const phoneNumber = req.params.phoneNumber;
      const client = await clientController.getClientByNumber(phoneNumber);
      if (client) {
        await clientController.deleteClientByNumber(phoneNumber);
        res.status(200).send({ message: "Client deleted successfully" });
      } else {
        res.status(404).send({ error: "Client not found" });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).send({ error: "Failed to delete client" });
    }
  },
);

clientRouter.post(
  "/update/:phoneNumber",
  async (req: Request<{ phoneNumber: string }>, res: Response) => {
    try {
      const client = await clientController.updateClientByNumber(
        req.params.phoneNumber,
        req.body,
      );
      if (client) {
        res.status(200).send(client);
      } else {
        res.status(404).send({ error: "Client not found" });
      }
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).send({ error: "Failed to update client" });
    }
  },
);

export default clientRouter;
