import { Hono } from "hono";
import { AppBindings } from "../types";
import { ClientController } from "../controllers/client.controller";
import { ClientService } from "../services/client.service";
import ClientsRepository from "../repositories/clients.repository";

const clientRouter = new Hono<{ Bindings: AppBindings }>();

function getController(env: AppBindings): ClientController {
  const repo = new ClientsRepository(env.DB);
  const service = new ClientService(repo);
  return new ClientController(service);
}

clientRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const client = await getController(c.env).createClient(body);
    return c.json(client, 201);
  } catch (error) {
    console.error("Error creating client:", error);
    return c.json({ error: "Failed to create client" }, 500);
  }
});

clientRouter.get("/", async (c) => {
  try {
    const clients = await getController(c.env).getAllClients();
    return c.json(clients, 200);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return c.json({ error: "Failed to fetch clients" }, 500);
  }
});

clientRouter.get("/:phoneNumber", async (c) => {
  try {
    const client = await getController(c.env).getClientByNumber(
      c.req.param("phoneNumber"),
    );
    if (client) {
      return c.json(client, 200);
    }
    return c.json({ error: "Client not found" }, 404);
  } catch (error) {
    console.error("Error fetching client:", error);
    return c.json({ error: "Failed to fetch client" }, 500);
  }
});

clientRouter.post("/delete/:phoneNumber", async (c) => {
  try {
    const phoneNumber = c.req.param("phoneNumber");
    const controller = getController(c.env);
    const client = await controller.getClientByNumber(phoneNumber);
    if (client) {
      await controller.deleteClientByNumber(phoneNumber);
      return c.json({ message: "Client deleted successfully" }, 200);
    }
    return c.json({ error: "Client not found" }, 404);
  } catch (error) {
    console.error("Error deleting client:", error);
    return c.json({ error: "Failed to delete client" }, 500);
  }
});

clientRouter.post("/update/:phoneNumber", async (c) => {
  try {
    const body = await c.req.json();
    const client = await getController(c.env).updateClientByNumber(
      c.req.param("phoneNumber"),
      body,
    );
    if (client) {
      return c.json(client, 200);
    }
    return c.json({ error: "Client not found" }, 404);
  } catch (error) {
    console.error("Error updating client:", error);
    return c.json({ error: "Failed to update client" }, 500);
  }
});

export default clientRouter;
