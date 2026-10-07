import type MyService from "./my-services.entity";

export default interface Category {
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  description?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  services?: MyService[];
}
