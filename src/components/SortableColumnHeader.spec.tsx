import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SortableColumnHeader from './SortableColumnHeader';
import type { SortState } from '../types';
import { SORT_DIRECTIONS } from '../types';

const mockOnSort = jest.fn();

describe('SortableColumnHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render label correctly', () => {
    const sortState: SortState = { field: null, direction: null };
    
    render(
      <table>
        <thead>
          <tr>
            <SortableColumnHeader
              label="Test Column"
              field="firstName"
              currentSort={sortState}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('Test Column')).toBeInTheDocument();
  });

  it('should call onSort when clicked', () => {
    const sortState: SortState = { field: null, direction: null };
    
    render(
      <table>
        <thead>
          <tr>
            <SortableColumnHeader
              label="Test Column"
              field="firstName"
              currentSort={sortState}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const header = screen.getByText('Test Column').closest('th');
    fireEvent.click(header!);

    expect(mockOnSort).toHaveBeenCalledWith('firstName');
  });

  it('should show ascending indicator when field is sorted ascending', () => {
    const sortState: SortState = { field: 'firstName', direction: SORT_DIRECTIONS.ASC };
    
    render(
      <table>
        <thead>
          <tr>
            <SortableColumnHeader
              label="Test Column"
              field="firstName"
              currentSort={sortState}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('▲')).toBeInTheDocument();
    expect(screen.getByText('▲')).toHaveClass('text-blue-500');
  });

  it('should show descending indicator when field is sorted descending', () => {
    const sortState: SortState = { field: 'firstName', direction: SORT_DIRECTIONS.DESC };
    
    render(
      <table>
        <thead>
          <tr>
            <SortableColumnHeader
              label="Test Column"
              field="firstName"
              currentSort={sortState}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('▼')).toBeInTheDocument();
    expect(screen.getByText('▼')).toHaveClass('text-blue-500');
  });

  it('should show neutral indicator when field is not sorted', () => {
    const sortState: SortState = { field: null, direction: null };
    
    render(
      <table>
        <thead>
          <tr>
            <SortableColumnHeader
              label="Test Column"
              field="firstName"
              currentSort={sortState}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('▼▲')).toBeInTheDocument();
    expect(screen.getByText('▼▲')).toHaveClass('text-gray-400');
  });

  it('should show neutral indicator when different field is sorted', () => {
    const sortState: SortState = { field: 'lastName', direction: SORT_DIRECTIONS.ASC };
    
    render(
      <table>
        <thead>
          <tr>
            <SortableColumnHeader
              label="Test Column"
              field="firstName"
              currentSort={sortState}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('▼▲')).toBeInTheDocument();
    expect(screen.getByText('▼▲')).toHaveClass('text-gray-400');
  });

  it('should have proper CSS classes for clickable functionality', () => {
    const sortState: SortState = { field: null, direction: null };
    
    const { container } = render(
      <table>
        <thead>
          <tr>
            <SortableColumnHeader
              label="Test Column"
              field="firstName"
              currentSort={sortState}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const header = container.querySelector('th');
    expect(header).toHaveClass('cursor-pointer', 'hover:bg-gray-100', 'select-none');
  });

  it('should have proper structure with flex layout', () => {
    const sortState: SortState = { field: null, direction: null };
    
    const { container } = render(
      <table>
        <thead>
          <tr>
            <SortableColumnHeader
              label="Test Column"
              field="firstName"
              currentSort={sortState}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const titleDiv = container.querySelector('.ant-table-column-title');
    expect(titleDiv).toHaveClass('flex', 'items-center');
  });
}); 