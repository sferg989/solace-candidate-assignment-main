import { HttpClient } from "tsbase/Net/Http/HttpClient";
import type { 
  Advocate, 
  AdvocateSearchParams
} from "@/types";
import { ENDPOINTS } from "@/types";

export interface IAdvocateService {
  getAdvocates(params?: AdvocateSearchParams): Promise<Advocate[]>;
}

export class AdvocateService implements IAdvocateService {
  private readonly httpClient: HttpClient;
  private readonly baseUrl: string;

  constructor(httpClient: HttpClient, baseUrl: string = '') {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  async getAdvocates(params?: AdvocateSearchParams): Promise<Advocate[]> {
    try {
      const url = this.buildUrl(ENDPOINTS.ADVOCATES, params);
      const response = await this.httpClient.Get<{ data: Advocate[] }>(url);
      

      if (response?.body?.data && Array.isArray(response.body.data)) {
        return response.body.data;
      }
      

      console.warn('Unexpected response structure:', response);
      return [];
    } catch (error) {
      console.error('Failed to fetch advocates:', error);
      throw new Error('Failed to fetch advocates');
    }
  }

  private buildUrl(endpoint: string, params?: AdvocateSearchParams): string {
    const url = new URL(endpoint, this.baseUrl || window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }
}

export const createAdvocateService = (): IAdvocateService => {
  const httpClient = new HttpClient();
  return new AdvocateService(httpClient);
}; 