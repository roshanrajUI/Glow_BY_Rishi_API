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
