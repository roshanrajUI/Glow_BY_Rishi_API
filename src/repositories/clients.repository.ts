import { Service } from "typedi";
import dbConfig from "../config/db.config";
import Client from "../models/entities/clients.entity";
import { ClientCreate } from "../models/interfaces/common-interfaces";

@Service()
export default class ClientsRepository {
  clientRepository = dbConfig.getRepository(Client);
  constructor() {}

  async createClient(client: ClientCreate): Promise<Client> {
    return this.clientRepository.save(client);
  }

  async getAllClients(): Promise<Client[]> {
    return this.clientRepository.find({ where: { isActive: true } });
  }

  async getClientByNumber(phoneNumber: string): Promise<Client | null> {
    const selectedClient = await this.clientRepository.findOne({
      where: { phoneNumber, isActive: true },
    });
    return selectedClient;
  }

  async updateClient(
    phoneNumber: string,
    client: Partial<Client>,
  ): Promise<Client> {
    const clientToUpdate = await this.getClientByNumber(phoneNumber);
    if (!clientToUpdate) {
      throw new Error("Client not found");
    }
    Object.assign(clientToUpdate, client);
    return this.clientRepository.save(clientToUpdate);
  }

  async deleteClient(phoneNumber: string): Promise<void> {
    const clientToDelete = await this.getClientByNumber(phoneNumber);
    if (!clientToDelete) {
      throw new Error("Client not found");
    }
    clientToDelete.isActive = false;
    await this.clientRepository.save(clientToDelete);
  }
}
