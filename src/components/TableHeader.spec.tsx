import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableHeader from './TableHeader';
import type { SortState } from '../types';
import { SORT_DIRECTIONS } from '../types';

const mockOnSort = jest.fn();

const defaultSortState: SortState = {
  field: null,
  direction: null,
};

describe('TableHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all column headers', () => {
    render(
      <table>
        <TableHeader currentSort={defaultSortState} onSort={mockOnSort} />
      </table>
    );

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Degree')).toBeInTheDocument();
    expect(screen.getByText('Specialties')).toBeInTheDocument();
    expect(screen.getByText('Years of Experience')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
  });

  it('should call onSort when clicking on sortable headers', () => {
    render(
      <table>
        <TableHeader currentSort={defaultSortState} onSort={mockOnSort} />
      </table>
    );

    const firstNameHeader = screen.getByText('First Name').closest('th');
    fireEvent.click(firstNameHeader!);

    expect(mockOnSort).toHaveBeenCalledWith('firstName');
  });

  it('should show sort indicators for active sort', () => {
    const activeSortState: SortState = {
      field: 'lastName',
      direction: SORT_DIRECTIONS.ASC,
    };

    render(
      <table>
        <TableHeader currentSort={activeSortState} onSort={mockOnSort} />
      </table>
    );

    const lastNameHeader = screen.getByText('Last Name').closest('th');
    expect(lastNameHeader).toHaveTextContent('▲');
  });

  it('should have proper styling classes for sortable headers', () => {
    const { container } = render(
      <table>
        <TableHeader currentSort={defaultSortState} onSort={mockOnSort} />
      </table>
    );

    const thead = container.querySelector('thead');
    expect(thead).toHaveClass('ant-table-thead', 'bg-gray-50');

    const sortableHeaders = container.querySelectorAll('th[class*="cursor-pointer"]');
    expect(sortableHeaders.length).toBe(5); // 5 sortable columns
    
    sortableHeaders.forEach((header) => {
      expect(header).toHaveClass('cursor-pointer', 'hover:bg-gray-100');
    });
  });

  it('should have non-sortable columns without cursor pointer', () => {
    const { container } = render(
      <table>
        <TableHeader currentSort={defaultSortState} onSort={mockOnSort} />
      </table>
    );

    const specialtiesHeader = screen.getByText('Specialties').closest('th');
    const phoneHeader = screen.getByText('Phone Number').closest('th');
    
    expect(specialtiesHeader).not.toHaveClass('cursor-pointer');
    expect(phoneHeader).not.toHaveClass('cursor-pointer');
  });

  it('should have specialties column with proper width class', () => {
    const { container } = render(
      <table>
        <TableHeader currentSort={defaultSortState} onSort={mockOnSort} />
      </table>
    );

    const specialtiesHeader = screen.getByText('Specialties').closest('th');
    expect(specialtiesHeader).toHaveClass('min-w-48');
  });

  it('should render exactly 7 column headers', () => {
    const { container } = render(
      <table>
        <TableHeader currentSort={defaultSortState} onSort={mockOnSort} />
      </table>
    );

    const headerCells = container.querySelectorAll('th');
    expect(headerCells).toHaveLength(7);
  });
}); 