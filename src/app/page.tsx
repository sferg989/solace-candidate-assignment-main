import type { Advocate, ApiResponse } from "@/types";
import { ENDPOINTS } from "@/types";
import AdvocateTable from "@/components/advocateTable";


async function getInitialAdvocates(): Promise<Advocate[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${ENDPOINTS.ADVOCATES}`, {
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch advocates');
    }
    
    const data: ApiResponse<Advocate[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch initial advocates:', error);
    return []; 
  }
}


export default async function Home() {
  const initialAdvocates = await getInitialAdvocates();

  return <AdvocateTable initialAdvocates={initialAdvocates} />;
}
