import { GET } from './route';

import { advocateSearchService } from '../../../db/services/advocate-search';

const mockOrderBy = jest.fn();
const mockWhere = jest.fn();
const mockFrom = jest.fn();
const mockSelect = jest.fn();

jest.mock('../../../db', () => ({
  __esModule: true,
  default: {
    select: jest.fn(),
  },
}));

import db from '../../../db';
const mockDb = db as jest.Mocked<NonNullable<typeof db>>;

jest.mock('../../../db/services/advocate-search', () => ({
  advocateSearchService: {
    buildFullTextSearchClause: jest.fn(),
    buildOrderClause: jest.fn(),
  },
}));

jest.mock('../../../db/seed/advocates', () => ({
  advocateData: [
    {
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      degree: 'Computer Science',
      specialties: ['Software Development'],
      yearsOfExperience: 5,
      phoneNumber: 1234567890,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'San Francisco',
      degree: 'Engineering',
      specialties: ['Machine Learning'],
      yearsOfExperience: 8,
      phoneNumber: 9876543210,
    },
    {
      firstName: 'Alice',
      lastName: 'Brown',
      city: 'Austin',
      degree: 'Mathematics',
      specialties: ['Data Science'],
      yearsOfExperience: 3,
      phoneNumber: 5555555555,
    },
  ],
}));

const mockAdvocateSearchService = advocateSearchService as jest.Mocked<typeof advocateSearchService>;

describe('Advocates API Route', () => {
  const mockAdvocateData = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      degree: 'Computer Science',
      specialties: ['Software Development'],
      yearsOfExperience: 5,
      phoneNumber: 1234567890,
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
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    

    mockOrderBy.mockResolvedValue(mockAdvocateData);
    mockWhere.mockReturnValue({ orderBy: mockOrderBy });
    mockFrom.mockReturnValue({ 
      orderBy: mockOrderBy,
      where: mockWhere
    });
    mockSelect.mockReturnValue({ from: mockFrom });
    (mockDb as any).select.mockImplementation(mockSelect);
    

    mockAdvocateSearchService.buildOrderClause.mockReturnValue({} as any);
    mockAdvocateSearchService.buildFullTextSearchClause.mockReturnValue({} as any);
    

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/advocates', () => {
    it('should return all advocates without search query', async () => {
      const request = new Request('http://localhost:3000/api/advocates');
      
      const response = await GET(request);
      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result).toEqual({ data: mockAdvocateData });
      expect(mockAdvocateSearchService.buildOrderClause).toHaveBeenCalledWith(undefined, undefined);
      expect(mockAdvocateSearchService.buildFullTextSearchClause).not.toHaveBeenCalled();
      expect((mockDb as any).select).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalled();
    });

    it('should return filtered advocates with search query', async () => {
      const request = new Request('http://localhost:3000/api/advocates?q=John');
      
      const response = await GET(request);
      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result).toEqual({ data: mockAdvocateData });
      expect(mockAdvocateSearchService.buildFullTextSearchClause).toHaveBeenCalledWith('John');
      expect(mockAdvocateSearchService.buildOrderClause).toHaveBeenCalledWith(undefined, undefined);
      expect(mockWhere).toHaveBeenCalled();
    });

    it('should handle ordering parameters', async () => {
      const request = new Request('http://localhost:3000/api/advocates?orderBy=firstName&sort=desc');
      
      const response = await GET(request);
      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result).toEqual({ data: mockAdvocateData });
      expect(mockAdvocateSearchService.buildOrderClause).toHaveBeenCalledWith('firstName', 'desc');
    });

    it('should handle search query with ordering parameters', async () => {
      const request = new Request('http://localhost:3000/api/advocates?q=engineer&orderBy=yearsOfExperience&sort=asc');
      
      const response = await GET(request);
      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result).toEqual({ data: mockAdvocateData });
      expect(mockAdvocateSearchService.buildFullTextSearchClause).toHaveBeenCalledWith('engineer');
      expect(mockAdvocateSearchService.buildOrderClause).toHaveBeenCalledWith('yearsOfExperience', 'asc');
    });

    it('should ignore empty search query', async () => {
      const request = new Request('http://localhost:3000/api/advocates?q=   ');
      
      const response = await GET(request);
      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result).toEqual({ data: mockAdvocateData });
      expect(mockAdvocateSearchService.buildFullTextSearchClause).not.toHaveBeenCalled();
      expect(mockAdvocateSearchService.buildOrderClause).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should return 500 error when database is not configured', async () => {

      (mockDb as any).select.mockImplementation(() => {
        throw new Error("Database not configured");
      });
      
      const request = new Request('http://localhost:3000/api/advocates');
      
      const response = await GET(request);
      const result = await response.json();
      
      expect(response.status).toBe(500);
      expect(result).toEqual({ error: 'Failed to fetch advocates' });
      expect(console.error).toHaveBeenCalledWith('Error fetching advocates:', expect.any(Error));
    });

    it('should handle database query errors', async () => {

      mockOrderBy.mockRejectedValue(new Error('Database connection failed'));
      
      const request = new Request('http://localhost:3000/api/advocates');
      
      const response = await GET(request);
      const result = await response.json();
      
      expect(response.status).toBe(500);
      expect(result).toEqual({ error: 'Failed to fetch advocates' });
      expect(console.error).toHaveBeenCalledWith('Error fetching advocates:', expect.any(Error));
    });

    it('should handle search service errors', async () => {

      mockAdvocateSearchService.buildFullTextSearchClause.mockImplementation(() => {
        throw new Error('Search service error');
      });
      
      const request = new Request('http://localhost:3000/api/advocates?q=test');
      
      const response = await GET(request);
      const result = await response.json();
      
      expect(response.status).toBe(500);
      expect(result).toEqual({ error: 'Failed to fetch advocates' });
      expect(console.error).toHaveBeenCalledWith('Error fetching advocates:', expect.any(Error));
    });
  });
}); 