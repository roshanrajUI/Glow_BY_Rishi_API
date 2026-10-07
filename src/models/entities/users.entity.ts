export default interface User {
  userId: string;
  userName: string;
  gmail: string;
  phoneNumber: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
