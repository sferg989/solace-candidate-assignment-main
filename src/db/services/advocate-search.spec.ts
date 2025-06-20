import { sql, asc, desc } from 'drizzle-orm';
import { 
  AdvocateSearchService, 
  advocateSearchService, 
  buildFullTextSearchClause, 
  buildOrderClause,
  type SortDirection,
  type AdvocateOrderableField 
} from './advocate-search';
import { advocates } from '../schema';

// Mock the schema
jest.mock('../schema', () => ({
  advocates: {
    firstName: { name: 'first_name' },
    lastName: { name: 'last_name' },
    city: { name: 'city' },
    degree: { name: 'degree' },
    specialties: { name: 'payload' },
    yearsOfExperience: { name: 'years_of_experience' },
    phoneNumber: { name: 'phone_number' },
    createdAt: { name: 'created_at' },
  },
}));

// Mock drizzle-orm functions
jest.mock('drizzle-orm', () => ({
  sql: jest.fn(),
  asc: jest.fn(),
  desc: jest.fn(),
}));

const mockSql = sql as jest.MockedFunction<typeof sql>;
const mockAsc = asc as jest.MockedFunction<typeof asc>;
const mockDesc = desc as jest.MockedFunction<typeof desc>;

describe('AdvocateSearchService', () => {
  let service: AdvocateSearchService;

  beforeEach(() => {
    service = new AdvocateSearchService();
    jest.clearAllMocks();
  });

  describe('buildFullTextSearchClause', () => {
    it('should build a full-text search clause for valid search term', () => {
      const searchTerm = 'software engineer';
      const mockSqlResult = { query: 'mocked sql' };
      mockSql.mockReturnValue(mockSqlResult as never);

      const result = service.buildFullTextSearchClause(searchTerm);

      expect(mockSql).toHaveBeenCalled();
      expect(result).toBe(mockSqlResult);
    });

    it('should throw error for empty search term', () => {
      expect(() => service.buildFullTextSearchClause('')).toThrow(
        'Search term cannot be empty'
      );
    });

    it('should throw error for whitespace-only search term', () => {
      expect(() => service.buildFullTextSearchClause('   ')).toThrow(
        'Search term cannot be empty'
      );
    });

    it('should handle search terms with special characters', () => {
      const searchTerm = 'C++ & JavaScript';
      const mockSqlResult = { query: 'mocked sql' };
      mockSql.mockReturnValue(mockSqlResult as never);

      const result = service.buildFullTextSearchClause(searchTerm);

      expect(mockSql).toHaveBeenCalled();
      expect(result).toBe(mockSqlResult);
    });
  });

  describe('buildOrderClause', () => {
    beforeEach(() => {
      mockAsc.mockReturnValue('ASC_RESULT' as never);
      mockDesc.mockReturnValue('DESC_RESULT' as never);
    });

    it('should build ascending order clause with default field (lastName)', () => {
      const result = service.buildOrderClause();

      expect(mockAsc).toHaveBeenCalledWith(advocates.lastName);
      expect(result).toBe('ASC_RESULT');
    });

    it('should build descending order clause when specified', () => {
      const result = service.buildOrderClause('lastName', 'desc');

      expect(mockDesc).toHaveBeenCalledWith(advocates.lastName);
      expect(result).toBe('DESC_RESULT');
    });

    it('should build ascending order clause when explicitly specified', () => {
      const result = service.buildOrderClause('city', 'asc');

      expect(mockAsc).toHaveBeenCalledWith(advocates.city);
      expect(result).toBe('ASC_RESULT');
    });

    it('should handle all valid orderable fields', () => {
      const validFields: AdvocateOrderableField[] = [
        'firstName',
        'lastName',
        'city',
        'degree',
        'yearsOfExperience',
        'phoneNumber',
        'createdAt'
      ];

      validFields.forEach(field => {
        service.buildOrderClause(field, 'asc');
        expect(mockAsc).toHaveBeenCalledWith(advocates[field]);
      });
    });

    it('should throw error for invalid field', () => {
      // Temporarily modify the advocates mock to simulate invalid field
      const originalAdvocates = { ...advocates };
      delete (advocates as never)['invalidField' as keyof typeof advocates];

      expect(() => 
        service.buildOrderClause('invalidField' as AdvocateOrderableField)
      ).toThrow('Invalid field for ordering: invalidField');

      // Restore the original advocates
      Object.assign(advocates, originalAdvocates);
    });

    it('should use default direction when not specified', () => {
      service.buildOrderClause('lastName');

      expect(mockAsc).toHaveBeenCalledWith(advocates.lastName);
      expect(mockDesc).not.toHaveBeenCalled();
    });
  });

});

describe('Exported Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildFullTextSearchClause', () => {
    it('should delegate to service method', () => {
      const searchTerm = 'test search';
      const mockSqlResult = { query: 'mocked sql' };
      mockSql.mockReturnValue(mockSqlResult as never);

      const result = buildFullTextSearchClause(searchTerm);

      expect(mockSql).toHaveBeenCalled();
      expect(result).toBe(mockSqlResult);
    });
  });

  describe('buildOrderClause', () => {
    beforeEach(() => {
      mockAsc.mockReturnValue('ASC_RESULT' as never);
      mockDesc.mockReturnValue('DESC_RESULT' as never);
    });

    it('should delegate to service method with defaults', () => {
      const result = buildOrderClause();

      expect(mockAsc).toHaveBeenCalledWith(advocates.lastName);
      expect(result).toBe('ASC_RESULT');
    });

    it('should delegate to service method with parameters', () => {
      const result = buildOrderClause('lastName', 'desc');

      expect(mockDesc).toHaveBeenCalledWith(advocates.lastName);
      expect(result).toBe('DESC_RESULT');
    });

    it('should handle undefined parameters', () => {
      const result = buildOrderClause(undefined, undefined);

      expect(mockAsc).toHaveBeenCalledWith(advocates.lastName);
      expect(result).toBe('ASC_RESULT');
    });
  });
});

describe('Singleton Instance', () => {
  it('should export a singleton instance', () => {
    expect(advocateSearchService).toBeInstanceOf(AdvocateSearchService);
  });

  it('should be the same instance on multiple imports', () => {
    const instance1 = advocateSearchService;
    const instance2 = advocateSearchService;

    expect(instance1).toBe(instance2);
  });
});

describe('Type Safety', () => {
  it('should enforce SortDirection type', () => {
    const validDirections: SortDirection[] = ['asc', 'desc'];
    
    validDirections.forEach(direction => {
      expect(() => buildOrderClause('firstName', direction)).not.toThrow();
    });
  });

  it('should enforce AdvocateOrderableField type', () => {
    const validFields: AdvocateOrderableField[] = [
      'firstName',
      'lastName',
      'city',
      'degree',
      'yearsOfExperience',
      'phoneNumber',
      'createdAt'
    ];

    validFields.forEach(field => {
      expect(() => buildOrderClause(field, 'asc')).not.toThrow();
    });
  });
}); 