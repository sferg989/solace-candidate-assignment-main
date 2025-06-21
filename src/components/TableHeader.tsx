import type { SortState, SortableField } from "@/types";
import SortableColumnHeader from "./SortableColumnHeader";

interface TableHeaderProps {
  currentSort: SortState;
  onSort: (field: SortableField) => void;
}

export default function TableHeader({ currentSort, onSort }: TableHeaderProps) {
  return (
    <thead className="ant-table-thead bg-gray-50">
      <tr className="ant-table-row">
        <SortableColumnHeader
          label="First Name"
          field="firstName"
          currentSort={currentSort}
          onSort={onSort}
        />
        <SortableColumnHeader
          label="Last Name"
          field="lastName"
          currentSort={currentSort}
          onSort={onSort}
        />
        <SortableColumnHeader
          label="City"
          field="city"
          currentSort={currentSort}
          onSort={onSort}
        />
        <SortableColumnHeader
          label="Degree"
          field="degree"
          currentSort={currentSort}
          onSort={onSort}
        />
        <th className="ant-table-cell ant-table-cell-with-append p-3 text-left font-semibold text-gray-700 border-b border-gray-200 min-w-48">
          <div className="ant-table-column-title">Specialties</div>
        </th>
        <SortableColumnHeader
          label="Years of Experience"
          field="yearsOfExperience"
          currentSort={currentSort}
          onSort={onSort}
        />
        <th className="ant-table-cell ant-table-cell-with-append p-3 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap">
          <div className="ant-table-column-title">Phone Number</div>
        </th>
      </tr>
    </thead>
  );
} 