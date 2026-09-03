export interface PaginationWithData<T> {
  data: T[];
  totalSize: number;
  pageSize: number;
  pageNumber: number;
}

export interface CategoryCreate {
  categoryId?: string;
  categoryName: string;
  description: string;
  isActive?: boolean;
}

export interface ServiceCreate {
  serviceId?: string;
  categoryId: string;
  serviceName: string;
  price: number;
  description: string;
  imageUrl?: Express.Multer.File;
}

export interface MyWorkCreate {
  serviceId: string;
  title: string;
  description: string;
  imageUrl?: string;
  userId?: string;
}

export interface ClientCreate {
  clientName: string;
  phoneNumber: string;
  gmail?: string;
  address: string;
}
