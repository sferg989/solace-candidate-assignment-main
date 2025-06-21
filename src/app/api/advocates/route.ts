import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateSearchService } from "../../../db/services/advocate-search";
import type { Advocate, SortDirection } from "../../../types";

export async function GET(request: Request): Promise<Response> {
  try {
    
    if (!db) {
      throw new Error("Database not configured");
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');
    const orderBy = searchParams.get('orderBy') as keyof typeof advocates.$inferSelect | null;
    const sortDirection = searchParams.get('sort') as SortDirection | null;

    let data: Advocate[];

    if (searchQuery?.trim()) {
      
      const searchClause = advocateSearchService.buildFullTextSearchClause(searchQuery);
      const orderClause = advocateSearchService.buildOrderClause(
        orderBy || undefined, 
        sortDirection || undefined
      );
      
      data = await db
        .select()
        .from(advocates)
        .where(searchClause)
        .orderBy(orderClause);
    } else {
      
      const orderClause = advocateSearchService.buildOrderClause(
        orderBy || undefined, 
        sortDirection || undefined
      );
      
      data = await db
        .select()
        .from(advocates)
        .orderBy(orderClause);
    }

    return Response.json({ data } satisfies { data: Advocate[] });
  } catch (error) {
    console.error('Error fetching advocates:', error);
    return Response.json({ error: 'Failed to fetch advocates' }, { status: 500 });
  }
}
