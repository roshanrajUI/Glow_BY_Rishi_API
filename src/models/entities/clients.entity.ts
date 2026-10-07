export default interface Client {
  clientId: string;
  clientName: string;
  phoneNumber: string;
  gmail: string;
  address?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
