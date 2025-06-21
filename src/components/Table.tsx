import type { ReactNode } from "react";
import { Table as AntTable } from "antd";
import "antd/dist/reset.css";

interface TableProps {
  children: ReactNode;
}

export default function Table({ children }: TableProps) {
  return (
    <div className="ant-table-wrapper w-full">
      <div className="ant-table ant-table-default ant-table-bordered rounded-lg border border-gray-200 overflow-hidden">
        <div className="ant-table-container">
          <div className="ant-table-content overflow-x-auto">
            <table className="ant-table-table w-full min-w-max table-auto">
              {children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 