import type MyService from "./my-services.entity";

export default interface WorkPortfolio {
  workId: string;
  serviceId: string;
  title: string;
  description?: string;
  imageUrl: string;
  workDate?: Date | string;
  userId: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  service?: MyService;
}
