export type Pagination<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
