import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table from './Table';

describe('Table', () => {
  it('should render children within table structure', () => {
    const { container } = render(
      <Table>
        <thead>
          <tr>
            <th>Test Header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test Data</td>
          </tr>
        </tbody>
      </Table>
    );

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('ant-table-table', 'w-full', 'min-w-max', 'table-auto');
  });

  it('should have proper wrapper structure with Tailwind classes', () => {
    const { container } = render(
      <Table>
        <tbody>
          <tr>
            <td>Content</td>
          </tr>
        </tbody>
      </Table>
    );

    const wrapper = container.querySelector('.ant-table-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('w-full');

    const tableContainer = container.querySelector('.ant-table');
    expect(tableContainer).toHaveClass('rounded-lg', 'border', 'border-gray-200', 'overflow-hidden');
  });

  it('should render empty table when no children provided', () => {
    const { container } = render(<Table>{null}</Table>);

    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
    expect(table?.children).toHaveLength(0);
  });
}); 