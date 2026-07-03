import { Service } from "typedi";
import { ClientService } from "../services/client.service";
import { Body, Get, Post, Route, Tags } from "tsoa";
import Client from "../models/entities/clients.entity";

@Route("api/clients")
@Tags("Clients")
@Service()
export class ClientController {
  constructor(readonly clientService: ClientService) {}

  @Post("/")
  async createClient(@Body() client: Client): Promise<Client> {
    return this.clientService.createClient(client);
  }

  @Get("/{phoneNumber}")
  async getClientByNumber(phoneNumber: string): Promise<Client | null> {
    return this.clientService.getClientByNumber(phoneNumber);
  }

  @Get("/")
  async getAllClients(): Promise<Client[]> {
    return this.clientService.getAllClients();
  }

  @Post("/delete/{phoneNumber}")
  async deleteClientByNumber(phoneNumber: string): Promise<void> {
    await this.clientService.deleteClient(phoneNumber);
  }

  @Post("/update/{phoneNumber}")
  async updateClientByNumber(
    phoneNumber: string,
    @Body() clientData: Partial<Client>,
  ): Promise<Client | null> {
    return this.clientService.updateClient(phoneNumber, clientData);
  }
}
