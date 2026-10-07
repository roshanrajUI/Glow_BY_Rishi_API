import type Category from "./service-category.entity";

export default interface MyService {
  serviceId: string;
  serviceName: string;
  price: number;
  description?: string;
  categoryId?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: Category;
}
