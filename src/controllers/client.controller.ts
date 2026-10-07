import { ClientService } from "../services/client.service";
import Client from "../models/entities/clients.entity";
import { ClientCreate } from "../models/interfaces/common-interfaces";

export class ClientController {
  constructor(readonly clientService: ClientService) {}

  async createClient(client: ClientCreate): Promise<Client> {
    return this.clientService.createClient(client);
  }

  async getClientByNumber(phoneNumber: string): Promise<Client | null> {
    return this.clientService.getClientByNumber(phoneNumber);
  }

  async getAllClients(): Promise<Client[]> {
    return this.clientService.getAllClients();
  }

  async deleteClientByNumber(phoneNumber: string): Promise<void> {
    await this.clientService.deleteClient(phoneNumber);
  }

  async updateClientByNumber(
    phoneNumber: string,
    clientData: Partial<Client>,
  ): Promise<Client | null> {
    return this.clientService.updateClient(phoneNumber, clientData);
  }
}
