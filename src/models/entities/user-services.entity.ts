import type User from "./users.entity";
import type MyService from "./my-services.entity";

export default interface UserService {
  userServiceId: string;
  userId: string;
  serviceId: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
  service?: MyService;
}
