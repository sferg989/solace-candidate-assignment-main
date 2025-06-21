import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableBody from './TableBody';
import type { Advocate } from '../types';

jest.mock('react-loading-skeleton', () => {
  return {
    __esModule: true,
    default: ({ count = 1 }: { count?: number }) => (
      <div data-testid="skeleton" data-count={count}>Loading...</div>
    ),
  };
});

jest.mock('./SpecialtiesCell', () => {
  return {
    __esModule: true,
    default: ({ specialties }: { specialties: unknown }) => (
      <div data-testid="specialties-cell">{Array.isArray(specialties) ? specialties.join(', ') : String(specialties)}</div>
    ),
  };
});

describe('TableBody', () => {
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

  it('should render advocates data when not loading', () => {
    render(
      <table>
        <TableBody advocates={mockAdvocates} isLoading={false} />
      </table>
    );

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('(123) 456-7890')).toBeInTheDocument();

    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('San Francisco')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('(987) 654-3210')).toBeInTheDocument();
  });

  it('should render skeleton rows when loading', () => {
    render(
      <table>
        <TableBody advocates={[]} isLoading={true} />
      </table>
    );

    const skeletons = screen.getAllByTestId('skeleton');

    expect(skeletons.length).toBeGreaterThan(30);
  });

  it('should use SpecialtiesCell for specialties column', () => {
    render(
      <table>
        <TableBody advocates={mockAdvocates} isLoading={false} />
      </table>
    );

    const specialtiesCells = screen.getAllByTestId('specialties-cell');
    expect(specialtiesCells).toHaveLength(2);
    expect(screen.getByText('React, TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js, Python')).toBeInTheDocument();
  });

  it('should apply proper CSS classes to rows and cells', () => {
    const { container } = render(
      <table>
        <TableBody advocates={[mockAdvocates[0]]} isLoading={false} />
      </table>
    );

    const tbody = container.querySelector('tbody');
    expect(tbody).toHaveClass('ant-table-tbody');

    const row = container.querySelector('tr');
    expect(row).toHaveClass('ant-table-row', 'hover:bg-gray-50');

    const cells = container.querySelectorAll('td');
    cells.forEach((cell) => {
      expect(cell).toHaveClass('ant-table-cell', 'p-3', 'border-b', 'border-gray-200');
    });
  });

  it('should handle empty advocates array', () => {
    const { container } = render(
      <table>
        <TableBody advocates={[]} isLoading={false} />
      </table>
    );

    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    expect(tbody?.children).toHaveLength(0);
  });

  it('should default isLoading to false when not provided', () => {
    render(
      <table>
        <TableBody advocates={mockAdvocates} />
      </table>
    );


    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });
}); 