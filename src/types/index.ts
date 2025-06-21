import type { InferSelectModel } from "drizzle-orm";
import { advocates } from "../db/schema";

export type Advocate = InferSelectModel<typeof advocates>; 

export const ENDPOINTS = {
  ADVOCATES: "/api/advocates"
} as const;

export type Endpoints = typeof ENDPOINTS[keyof typeof ENDPOINTS];

export const SORT_DIRECTIONS = {
  ASC: "asc",
  DESC: "desc"
} as const;

export type SortDirection = typeof SORT_DIRECTIONS[keyof typeof SORT_DIRECTIONS];

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: string;
}

export interface AdvocateSearchParams {
  q?: string;
  orderBy?: keyof Advocate;
  sort?: SortDirection;
}

export type SortableField = keyof Pick<Advocate, 'firstName' | 'lastName' | 'city' | 'degree' | 'yearsOfExperience'>;

export interface SortState {
  field: SortableField | null;
  direction: SortDirection | null;
}

export interface ColumnHeaderProps {
  label: string;
  field: SortableField;
  currentSort: SortState;
  onSort: (field: SortableField) => void;
}

export interface AdvocateTableProps {
  initialAdvocates: Advocate[];
}