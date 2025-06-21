import type { Advocate } from "@/types";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SpecialtiesCell from './SpecialtiesCell';
import { formatPhoneNumber } from '@/utils/phoneFormatter';

interface TableBodyProps {
  advocates: Advocate[];
  isLoading?: boolean;
}

export default function TableBody({ advocates, isLoading = false }: TableBodyProps) {
  if (isLoading) {
    
    return (
      <tbody className="ant-table-tbody">
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={`skeleton-${index}`} className="ant-table-row">
            <td className="ant-table-cell p-3 border-b border-gray-200"><Skeleton /></td>
            <td className="ant-table-cell p-3 border-b border-gray-200"><Skeleton /></td>
            <td className="ant-table-cell p-3 border-b border-gray-200"><Skeleton /></td>
            <td className="ant-table-cell p-3 border-b border-gray-200"><Skeleton /></td>
            <td className="ant-table-cell p-3 border-b border-gray-200 min-w-48"><Skeleton count={2} /></td>
            <td className="ant-table-cell p-3 border-b border-gray-200"><Skeleton /></td>
            <td className="ant-table-cell p-3 border-b border-gray-200"><Skeleton /></td>
          </tr>
        ))}
      </tbody>
    );
  }

  return (
    <tbody className="ant-table-tbody">
      {advocates.map((advocate, index) => (
        <tr key={advocate.id} className={`ant-table-row hover:bg-gray-50 ${index % 2 === 0 ? 'ant-table-row-level-0 bg-white' : 'bg-gray-25'}`}>
          <td className="ant-table-cell p-3 border-b border-gray-200 whitespace-nowrap">{advocate.firstName}</td>
          <td className="ant-table-cell p-3 border-b border-gray-200 whitespace-nowrap">{advocate.lastName}</td>
          <td className="ant-table-cell p-3 border-b border-gray-200 whitespace-nowrap">{advocate.city}</td>
          <td className="ant-table-cell p-3 border-b border-gray-200 whitespace-nowrap">{advocate.degree}</td>
          <td className="ant-table-cell p-3 border-b border-gray-200 min-w-48 max-w-xs">
            <SpecialtiesCell specialties={advocate.specialties} />
          </td>
          <td className="ant-table-cell p-3 border-b border-gray-200 whitespace-nowrap text-center">{advocate.yearsOfExperience}</td>
          <td className="ant-table-cell p-3 border-b border-gray-200 whitespace-nowrap">{formatPhoneNumber(advocate.phoneNumber)}</td>
        </tr>
      ))}
    </tbody>
  );
} 