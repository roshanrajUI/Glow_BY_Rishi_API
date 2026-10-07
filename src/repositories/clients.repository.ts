import Client from "../models/entities/clients.entity";
import { ClientCreate } from "../models/interfaces/common-interfaces";
import { execute, fetchAll, fetchOne, newId, nowIso, toBool } from "../lib/db";

interface ClientRow {
  client_id: string;
  client_name: string;
  phone_number: string;
  gmail: string;
  address: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

function mapClient(row: ClientRow): Client {
  return {
    clientId: row.client_id,
    clientName: row.client_name,
    phoneNumber: row.phone_number,
    gmail: row.gmail,
    address: row.address ?? undefined,
    isActive: toBool(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const CLIENT_SELECT = "SELECT * FROM clients";

export default class ClientsRepository {
  constructor(private readonly db: D1Database) {}

  async createClient(client: ClientCreate): Promise<Client> {
    const clientId = newId();
    const now = nowIso();
    await execute(
      this.db,
      `INSERT INTO clients (client_id, client_name, phone_number, gmail, address, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      [clientId, client.clientName, client.phoneNumber, client.gmail ?? null, client.address ?? null, now, now],
    );
    const created = await fetchOne<ClientRow>(this.db, `${CLIENT_SELECT} WHERE client_id = ?`, [clientId]);
    return mapClient(created!);
  }

  async getAllClients(): Promise<Client[]> {
    const rows = await fetchAll<ClientRow>(this.db, `${CLIENT_SELECT} WHERE is_active = 1`);
    return rows.map(mapClient);
  }

  async getClientByNumber(phoneNumber: string): Promise<Client | null> {
    const row = await fetchOne<ClientRow>(
      this.db,
      `${CLIENT_SELECT} WHERE phone_number = ? AND is_active = 1`,
      [phoneNumber],
    );
    return row ? mapClient(row) : null;
  }

  async updateClient(phoneNumber: string, client: Partial<Client>): Promise<Client> {
    const clientToUpdate = await this.getClientByNumber(phoneNumber);
    if (!clientToUpdate) {
      throw new Error("Client not found");
    }
    const merged = { ...clientToUpdate, ...client };
    await execute(
      this.db,
      `UPDATE clients SET client_name = ?, gmail = ?, address = ?, updated_at = ? WHERE client_id = ?`,
      [merged.clientName, merged.gmail, merged.address ?? null, nowIso(), clientToUpdate.clientId],
    );
    return (await this.getClientByNumber(phoneNumber))!;
  }

  async deleteClient(phoneNumber: string): Promise<void> {
    const clientToDelete = await this.getClientByNumber(phoneNumber);
    if (!clientToDelete) {
      throw new Error("Client not found");
    }
    await execute(this.db, `UPDATE clients SET is_active = 0, updated_at = ? WHERE client_id = ?`, [
      nowIso(),
      clientToDelete.clientId,
    ]);
  }
}
