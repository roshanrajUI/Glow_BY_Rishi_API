import { Service } from "typedi";
import clientsRepository from "../repositories/clients.repository";
import Client from "../models/entities/clients.entity";
import { ClientCreate } from "../models/interfaces/common-interfaces";

@Service()
export class ClientService {
  constructor(readonly clientRepository: clientsRepository) {}

  async createClient(client: ClientCreate): Promise<Client> {
    return await this.clientRepository.createClient(client);
  }

  async getAllClients(): Promise<Client[]> {
    return await this.clientRepository.getAllClients();
  }

  async getClientByNumber(phoneNumber: string): Promise<Client | null> {
    return await this.clientRepository.getClientByNumber(phoneNumber);
  }

  async updateClient(
    phoneNumber: string,
    client: Partial<Client>,
  ): Promise<Client> {
    return await this.clientRepository.updateClient(phoneNumber, client);
  }

  async deleteClient(phoneNumber: string): Promise<void> {
    return await this.clientRepository.deleteClient(phoneNumber);
  }
}
