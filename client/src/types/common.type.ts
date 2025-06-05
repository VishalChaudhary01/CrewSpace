export interface BaseEntity {
  _id: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BaseResponse<T> {
  message: string;
  data?: T;
}

export interface Pagination {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  skip: number;
  limit?: number;
}

export interface BaseUser {
  _id: string;
  name: string;
  email: string;
}

export interface Analytics {
  totalTasks: number;
  overdueTasks: number;
  completedTasks: number;
}

// RESPONSE TYPES
export type AnalyticsResponse = BaseResponse<{
  analytics: Analytics;
}>;
