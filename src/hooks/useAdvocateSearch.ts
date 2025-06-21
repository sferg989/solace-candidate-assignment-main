import { useState, useCallback, useMemo } from 'react';
import type { Advocate, AdvocateSearchParams } from '@/types';
import { createAdvocateService, type IAdvocateService } from '@/services/advocateService';

interface UseAdvocateSearchReturn {
  searchAdvocates: (params?: AdvocateSearchParams) => Promise<Advocate[]>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useAdvocateSearch(): UseAdvocateSearchReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  
  const advocateService = useMemo<IAdvocateService>(() => createAdvocateService(), []);

  const searchAdvocates = useCallback(async (params?: AdvocateSearchParams): Promise<Advocate[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await advocateService.getAdvocates(params);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [advocateService]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    searchAdvocates,
    isLoading,
    error,
    clearError
  };
} 