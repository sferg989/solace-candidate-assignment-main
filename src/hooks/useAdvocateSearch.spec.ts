import { renderHook, act, waitFor } from '@testing-library/react';
import { useAdvocateSearch } from './useAdvocateSearch';
import type { Advocate, AdvocateSearchParams } from '../types';
import { SORT_DIRECTIONS } from '../types';
import { createAdvocateService } from '../services/advocateService';

// Mock the advocateService
const mockAdvocateService = {
  getAdvocates: jest.fn(),
};

// Mock the createAdvocateService function
jest.mock('../services/advocateService', () => ({
  createAdvocateService: jest.fn(() => mockAdvocateService),
}));

const mockCreateAdvocateService = createAdvocateService as jest.MockedFunction<typeof createAdvocateService>;

describe('useAdvocateSearch', () => {
  const mockAdvocateData: Advocate[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      degree: 'Computer Science',
      specialties: ['Software Development'],
      yearsOfExperience: 5,
      phoneNumber: 1234567890,
      createdAt: new Date(),
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'San Francisco',
      degree: 'Engineering',
      specialties: ['Machine Learning'],
      yearsOfExperience: 8,
      phoneNumber: 9876543210,
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockAdvocateService.getAdvocates.mockResolvedValue(mockAdvocateData);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useAdvocateSearch());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.searchAdvocates).toBe('function');
      expect(typeof result.current.clearError).toBe('function');
    });
  });

  describe('searchAdvocates', () => {
    it('should successfully search advocates without parameters', async () => {
      const { result } = renderHook(() => useAdvocateSearch());

      let searchResult: Advocate[] = [];

      await act(async () => {
        searchResult = await result.current.searchAdvocates();
      });

      expect(mockAdvocateService.getAdvocates).toHaveBeenCalledWith(undefined);
      expect(searchResult).toEqual(mockAdvocateData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should successfully search advocates with parameters', async () => {
      const { result } = renderHook(() => useAdvocateSearch());

      const searchParams: AdvocateSearchParams = {
        q: 'john',
        orderBy: 'firstName',
        sort: SORT_DIRECTIONS.ASC,
      };

      let searchResult: Advocate[] = [];

      await act(async () => {
        searchResult = await result.current.searchAdvocates(searchParams);
      });

      expect(mockAdvocateService.getAdvocates).toHaveBeenCalledWith(searchParams);
      expect(searchResult).toEqual(mockAdvocateData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should set loading state during search', async () => {
      // Make the service call take some time
      let resolvePromise: (value: Advocate[]) => void;
      const promise = new Promise<Advocate[]>((resolve) => {
        resolvePromise = resolve;
      });
      mockAdvocateService.getAdvocates.mockReturnValue(promise);

      const { result } = renderHook(() => useAdvocateSearch());

      // Start the search
      act(() => {
        result.current.searchAdvocates();
      });

      // Check loading state is true
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);

      // Resolve the promise
      await act(async () => {
        resolvePromise!(mockAdvocateData);
      });

      // Check loading state is false after completion
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle search errors correctly', async () => {
      const mockError = new Error('Search failed');
      mockAdvocateService.getAdvocates.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAdvocateSearch());

      await act(async () => {
        try {
          await result.current.searchAdvocates();
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Search failed');
      });
    });

    it('should handle unknown errors correctly', async () => {
      const unknownError = 'Unknown error';
      mockAdvocateService.getAdvocates.mockRejectedValue(unknownError);

      const { result } = renderHook(() => useAdvocateSearch());

      await act(async () => {
        try {
          await result.current.searchAdvocates();
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('An unknown error occurred');
      });
    });

    it('should clear error before new search', async () => {
      const { result } = renderHook(() => useAdvocateSearch());

      // First search that fails
      const mockError = new Error('First error');
      mockAdvocateService.getAdvocates.mockRejectedValueOnce(mockError);

      await act(async () => {
        try {
          await result.current.searchAdvocates();
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('First error');
      });

      // Second search that succeeds
      mockAdvocateService.getAdvocates.mockResolvedValueOnce(mockAdvocateData);

      await act(async () => {
        await result.current.searchAdvocates();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      const { result } = renderHook(() => useAdvocateSearch());

      // Trigger an error first
      const mockError = new Error('Test error');
      mockAdvocateService.getAdvocates.mockRejectedValue(mockError);

      await act(async () => {
        try {
          await result.current.searchAdvocates();
        } catch (error) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Test error');
      });

      // Clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('service instance memoization', () => {
    it('should use the same service instance across renders', () => {
      const { rerender } = renderHook(() => useAdvocateSearch());

      const callCount1 = mockCreateAdvocateService.mock.calls.length;

      rerender();

      const callCount2 = mockCreateAdvocateService.mock.calls.length;

      // Service should only be created once due to useMemo
      expect(callCount2).toBe(callCount1);
    });
  });

  describe('callback stability', () => {
    it('should have stable searchAdvocates callback', () => {
      const { result, rerender } = renderHook(() => useAdvocateSearch());

      const firstSearchAdvocates = result.current.searchAdvocates;

      rerender();

      const secondSearchAdvocates = result.current.searchAdvocates;

      // Callback should be stable due to useCallback
      expect(firstSearchAdvocates).toBe(secondSearchAdvocates);
    });

    it('should have stable clearError callback', () => {
      const { result, rerender } = renderHook(() => useAdvocateSearch());

      const firstClearError = result.current.clearError;

      rerender();

      const secondClearError = result.current.clearError;

      // Callback should be stable due to useCallback
      expect(firstClearError).toBe(secondClearError);
    });
  });
}); 