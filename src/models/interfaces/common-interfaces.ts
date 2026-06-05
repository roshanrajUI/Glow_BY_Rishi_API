export interface PaginationWithData<T> {
  data: T[];
  totalSize: number;
  pageSize: number;
  pageNumber: number;
}
