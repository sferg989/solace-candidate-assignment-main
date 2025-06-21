import type { ColumnHeaderProps, SortDirection } from "@/types";
import { SORT_DIRECTIONS } from "@/types";

const SortIcon = ({ direction }: { direction: SortDirection | null }) => {
  if (direction === SORT_DIRECTIONS.ASC) {
    return <span className="ml-1 text-blue-500">▲</span>;
  }
  if (direction === SORT_DIRECTIONS.DESC) {
    return <span className="ml-1 text-blue-500">▼</span>;
  }
  return <span className="ml-1 text-gray-400">▼▲</span>;
};

export default function SortableColumnHeader({
  label,
  field,
  currentSort,
  onSort,
}: ColumnHeaderProps) {
  const isActive = currentSort.field === field;
  const direction = isActive ? currentSort.direction : null;

  return (
    <th 
      className="ant-table-cell ant-table-cell-with-append p-3 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
      onClick={() => onSort(field)}
    >
      <div className="ant-table-column-title flex items-center">
        {label}
        <SortIcon direction={direction} />
      </div>
    </th>
  );
} 