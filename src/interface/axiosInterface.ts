export type ResponseModel<T = unknown, K extends string = "data"> = {
  [key in K]: T;
} & { success: boolean; message: string; status?: number };

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  links: {
    active: boolean;
    label: string;
    url: string | null;
  }[];
}

export type ResponseModelList<T, K extends string = "data"> = ResponseModel<
  PaginatedData<T>,
  K
>;

export type PaginatedDataOptional<T> = Partial<PaginatedData<T>>;
