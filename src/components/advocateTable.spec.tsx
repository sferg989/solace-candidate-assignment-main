import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvocateTable from './advocateTable';
import type { Advocate } from '../types';

const mockSearchAdvocates = jest.fn();
const mockClearError = jest.fn();

jest.mock('../hooks/useAdvocateSearch', () => ({
  useAdvocateSearch: () => ({
    searchAdvocates: mockSearchAdvocates,
    isLoading: false,
    error: null,
    clearError: mockClearError,
  }),
}));

jest.mock('antd', () => ({
  Input: ({ value, onChange, onPressEnter, placeholder, prefix, size, className, disabled }: any) => (
    <input
      value={value}
      onChange={onChange}
      onKeyDown={(e) => e.key === 'Enter' && onPressEnter?.()}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      data-testid="search-input"
    />
  ),
  Button: ({ children, onClick, disabled, loading, className, icon, type }: any) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      data-testid={`button-${children?.toLowerCase()?.replace(/\s+/g, '-')}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  ),
  Space: ({ children, direction, size, className }: any) => (
    <div className={className} data-direction={direction} data-size={size}>
      {children}
    </div>
  ),
  Typography: {
    Title: ({ children, level, className }: any) => (
      <h1 className={className} data-level={level}>{children}</h1>
    ),
    Text: ({ children, strong, type, className }: any) => (
      <span className={className} data-strong={strong} data-type={type}>{children}</span>
    ),
  },
  Alert: ({ message, description, type, showIcon, closable, onClose }: any) => (
    <div data-testid="alert" data-type={type}>
      <div>{message}</div>
      <div>{description}</div>
      {closable && <button onClick={onClose}>×</button>}
    </div>
  ),
}));

jest.mock('@ant-design/icons', () => ({
  SearchOutlined: () => <span data-testid="search-icon">🔍</span>,
  ReloadOutlined: () => <span data-testid="reload-icon">🔄</span>,
}));

jest.mock('./Table', () => {
  const MockTable = ({ children }: { children: React.ReactNode }) => <div data-testid="table">{children}</div>;
  MockTable.displayName = 'MockTable';
  return MockTable;
});
jest.mock('./TableHeader', () => {
  const MockTableHeader = () => <div data-testid="table-header">Table Header</div>;
  MockTableHeader.displayName = 'MockTableHeader';
  return MockTableHeader;
});
jest.mock('./TableBody', () => {
  const MockTableBody = ({ advocates, isLoading }: { advocates: any[], isLoading: boolean }) => (
    <div data-testid="table-body" data-loading={isLoading}>
      {advocates.map((advocate) => (
        <div key={advocate.id}>{advocate.firstName} {advocate.lastName}</div>
      ))}
    </div>
  );
  MockTableBody.displayName = 'MockTableBody';
  return MockTableBody;
});

describe('AdvocateTable', () => {
  const mockAdvocates: Advocate[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      degree: 'Computer Science',
      specialties: ['React', 'TypeScript'],
      yearsOfExperience: 5,
      phoneNumber: 1234567890,
      createdAt: new Date('2023-01-01'),
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      city: 'San Francisco',
      degree: 'Engineering',
      specialties: ['Node.js', 'Python'],
      yearsOfExperience: 8,
      phoneNumber: 9876543210,
      createdAt: new Date('2023-01-02'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchAdvocates.mockResolvedValue(mockAdvocates);
  });

  it('should render the main title', () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    expect(screen.getByText('Solace Advocates')).toBeInTheDocument();
  });

  it('should render search input and buttons', () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('button-search')).toBeInTheDocument();
    expect(screen.getByTestId('button-reset')).toBeInTheDocument();
  });

  it('should display initial advocates in table', () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should update search term when typing', () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    expect(searchInput).toHaveValue('test query');
  });

  it('should call search when search button is clicked', async () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    const searchInput = screen.getByTestId('search-input');
    const searchButton = screen.getByTestId('button-search');
    
    fireEvent.change(searchInput, { target: { value: 'john' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(mockSearchAdvocates).toHaveBeenCalledWith({ q: 'john' });
    });
  });

  it('should call search when Enter key is pressed', async () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    fireEvent.change(searchInput, { target: { value: 'jane' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockSearchAdvocates).toHaveBeenCalledWith({ q: 'jane' });
    });
  });

  it('should reset search when reset button is clicked', () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    const searchInput = screen.getByTestId('search-input');
    const resetButton = screen.getByTestId('button-reset');
    
  
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput).toHaveValue('test');
    
  
    fireEvent.click(resetButton);
    expect(searchInput).toHaveValue('');
  });

  it('should show current search term', () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(screen.getByText('test search')).toBeInTheDocument();
  });

  it('should render table components', () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByTestId('table-header')).toBeInTheDocument();
    expect(screen.getByTestId('table-body')).toBeInTheDocument();
  });

  it('should handle empty search query by calling search without parameters', async () => {
    render(<AdvocateTable initialAdvocates={mockAdvocates} />);
    
    const searchButton = screen.getByTestId('button-search');
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(mockSearchAdvocates).toHaveBeenCalledWith(undefined);
    });
  });
}); 