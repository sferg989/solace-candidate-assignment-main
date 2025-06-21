import { sql, type SQL, asc, desc, type Column } from "drizzle-orm";
import { advocates } from "../schema";
import type { SortDirection } from "../../types";
import { SORT_DIRECTIONS } from "../../types";
export type AdvocateOrderableField = keyof typeof advocates.$inferSelect;

export class AdvocateSearchService {
  public buildFullTextSearchClause(searchTerm: string): SQL {
    if (!searchTerm.trim()) {
      throw new Error("Search term cannot be empty");
    }

    return sql`
      (
        to_tsvector('english', ${advocates.firstName}) ||
        to_tsvector('english', ${advocates.lastName}) ||
        to_tsvector('english', ${advocates.city}) ||
        to_tsvector('english', ${advocates.degree}) ||
        to_tsvector('english', ${advocates.specialties}::text) ||
        to_tsvector('english', ${advocates.yearsOfExperience}::text) ||
        to_tsvector('english', ${advocates.phoneNumber}::text)
      ) @@ plainto_tsquery('english', ${searchTerm})
    `;
  }

  public buildOrderClause(
    field: AdvocateOrderableField = "lastName",
    direction: SortDirection = SORT_DIRECTIONS.ASC
  ): ReturnType<typeof asc | typeof desc> {
    const column = advocates[field] as Column;
    
    if (!column) {
      throw new Error(`Invalid field for ordering: ${String(field)}`);
    }

    return direction === SORT_DIRECTIONS.DESC ? desc(column) : asc(column);
  }

}

export const advocateSearchService = new AdvocateSearchService();

export const buildFullTextSearchClause = (searchTerm: string): SQL => {
  return advocateSearchService.buildFullTextSearchClause(searchTerm);
};

export const buildOrderClause = (
  field?: AdvocateOrderableField,
  direction?: SortDirection
): ReturnType<typeof asc | typeof desc> => {
  return advocateSearchService.buildOrderClause(field, direction);
}; 