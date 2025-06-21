import { AdvocateService, createAdvocateService, type IAdvocateService } from './advocateService';
import type { Advocate, AdvocateSearchParams } from '../types';
import { ENDPOINTS, SORT_DIRECTIONS } from '../types';

// Mock the HttpClient
const mockHttpClient = {
  Get: jest.fn(),
};

// Mock the HttpClient module
jest.mock('tsbase/Net/Http/HttpClient', () => ({
  HttpClient: jest.fn().mockImplementation(() => mockHttpClient),
}));

describe('AdvocateService', () => {
  let advocateService: AdvocateService;
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
    advocateService = new AdvocateService(mockHttpClient as any);
    
    // Mock window.location for URL building
    delete (window as any).location;
    window.location = {
      origin: 'http://localhost:3000',
    } as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAdvocates', () => {
    it('should return advocates when API call is successful', async () => {
      const mockResponse = {
        body: {
          data: mockAdvocateData,
        },
      };
      mockHttpClient.Get.mockResolvedValue(mockResponse);

      const result = await advocateService.getAdvocates();

      expect(mockHttpClient.Get).toHaveBeenCalledWith('http://localhost:3000/api/advocates');
      expect(result).toEqual(mockAdvocateData);
    });

    it('should return advocates with search parameters', async () => {
      const mockResponse = {
        body: {
          data: mockAdvocateData,
        },
      };
      mockHttpClient.Get.mockResolvedValue(mockResponse);

      const searchParams: AdvocateSearchParams = {
        q: 'john',
        orderBy: 'firstName',
        sort: SORT_DIRECTIONS.ASC,
      };

      const result = await advocateService.getAdvocates(searchParams);

      expect(mockHttpClient.Get).toHaveBeenCalledWith(
        'http://localhost:3000/api/advocates?q=john&orderBy=firstName&sort=asc'
      );
      expect(result).toEqual(mockAdvocateData);
    });

    it('should handle empty search parameters', async () => {
      const mockResponse = {
        body: {
          data: mockAdvocateData,
        },
      };
      mockHttpClient.Get.mockResolvedValue(mockResponse);

      const searchParams: AdvocateSearchParams = {
        q: '',
      };

      const result = await advocateService.getAdvocates(searchParams);

      expect(mockHttpClient.Get).toHaveBeenCalledWith('http://localhost:3000/api/advocates');
      expect(result).toEqual(mockAdvocateData);
    });

    it('should filter out undefined and null parameters', async () => {
      const mockResponse = {
        body: {
          data: mockAdvocateData,
        },
      };
      mockHttpClient.Get.mockResolvedValue(mockResponse);

      const searchParams: AdvocateSearchParams = {
        q: 'test',
        orderBy: undefined,
        sort: undefined,
      };

      const result = await advocateService.getAdvocates(searchParams);

      expect(mockHttpClient.Get).toHaveBeenCalledWith('http://localhost:3000/api/advocates?q=test');
      expect(result).toEqual(mockAdvocateData);
    });

    it('should return empty array when response data is not an array', async () => {
      const mockResponse = {
        body: {
          data: 'not an array',
        },
      };
      mockHttpClient.Get.mockResolvedValue(mockResponse);

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await advocateService.getAdvocates();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Unexpected response structure:', mockResponse);

      consoleSpy.mockRestore();
    });

    it('should return empty array when response body is missing', async () => {
      const mockResponse = {};
      mockHttpClient.Get.mockResolvedValue(mockResponse);

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await advocateService.getAdvocates();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Unexpected response structure:', mockResponse);

      consoleSpy.mockRestore();
    });

    it('should throw error when HTTP request fails', async () => {
      const mockError = new Error('Network error');
      mockHttpClient.Get.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(advocateService.getAdvocates()).rejects.toThrow('Failed to fetch advocates');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch advocates:', mockError);

      consoleSpy.mockRestore();
    });
  });

  describe('buildUrl', () => {
    it('should build URL without parameters', () => {
      const service = new AdvocateService(mockHttpClient as any, 'https://api.example.com');
      
      // Access private method through any for testing
      const result = (service as any).buildUrl(ENDPOINTS.ADVOCATES);

      expect(result).toBe('https://api.example.com/api/advocates');
    });

    it('should build URL with custom base URL', () => {
      const service = new AdvocateService(mockHttpClient as any, 'https://custom.api.com');
      
      const result = (service as any).buildUrl(ENDPOINTS.ADVOCATES);

      expect(result).toBe('https://custom.api.com/api/advocates');
    });

    it('should use window location origin when baseUrl is empty', () => {
      const service = new AdvocateService(mockHttpClient as any, '');
      
      const result = (service as any).buildUrl(ENDPOINTS.ADVOCATES);

      expect(result).toBe('http://localhost:3000/api/advocates');
    });
  });
});

describe('createAdvocateService', () => {
  it('should create an instance of AdvocateService', () => {
    const service = createAdvocateService();

    expect(service).toBeInstanceOf(AdvocateService);
  });

  it('should implement IAdvocateService interface', () => {
    const service: IAdvocateService = createAdvocateService();

    expect(typeof service.getAdvocates).toBe('function');
  });
}); 