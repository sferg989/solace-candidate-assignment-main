import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpecialtiesCell from './SpecialtiesCell';

describe('SpecialtiesCell', () => {
  it('should render array of specialties as pills', () => {
    const specialties = ['React', 'TypeScript', 'Node.js'];
    
    render(<SpecialtiesCell specialties={specialties} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('should render long specialty text with proper word breaking', () => {
    const specialties = ['General Mental Health (anxiety, depression, stress, grief, life transitions)'];
    
    render(<SpecialtiesCell specialties={specialties} />);
    
    expect(screen.getByText('General Mental Health (anxiety, depression, stress, grief, life transitions)')).toBeInTheDocument();
  });

  it('should render non-array specialties as string', () => {
    const specialties = 'Single Specialty';
    
    render(<SpecialtiesCell specialties={specialties} />);
    
    expect(screen.getByText('Single Specialty')).toBeInTheDocument();
  });

  it('should handle empty array', () => {
    const specialties: string[] = [];
    
    render(<SpecialtiesCell specialties={specialties} />);
    
  
    const container = document.querySelector('.flex.flex-wrap');
    expect(container).toBeInTheDocument();
    expect(container?.children).toHaveLength(0);
  });

  it('should handle null specialties', () => {
    const specialties = null;
    
    render(<SpecialtiesCell specialties={specialties} />);
    
    expect(screen.getByText('null')).toBeInTheDocument();
  });

  it('should apply correct CSS classes to pills', () => {
    const specialties = ['Test Specialty'];
    
    render(<SpecialtiesCell specialties={specialties} />);
    
    const pill = screen.getByText('Test Specialty');
    expect(pill).toHaveClass('inline-block', 'px-2', 'py-1', 'text-xs', 'leading-4', 'bg-gray-50', 'border', 'border-gray-300', 'rounded-md', 'break-words');
  });
}); 