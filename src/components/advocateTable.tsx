"use client";

import { useState, useCallback, type ChangeEvent } from "react";
import type { Advocate, AdvocateTableProps, SortState, SortableField } from "@/types";
import { SORT_DIRECTIONS } from "@/types";
import { useAdvocateSearch } from "@/hooks/useAdvocateSearch";
import { Input, Button, Space, Typography, Alert } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import Table from "./Table";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

const { Title, Text } = Typography;

export default function AdvocateTable({ initialAdvocates }: AdvocateTableProps) {
  const [advocates] = useState<Advocate[]>(initialAdvocates);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>(initialAdvocates);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortState, setSortState] = useState<SortState>({ field: null, direction: null });
  
  const { searchAdvocates, isLoading, error, clearError } = useAdvocateSearch();

  const performSearch = useCallback(async (query: string, sort?: SortState) => {
    clearError();
    
    try {
      const searchParams = query.trim() ? { q: query } : undefined;
      
      
      const params = sort?.field && sort?.direction 
        ? { ...searchParams, orderBy: sort.field, sort: sort.direction }
        : searchParams;
      
      const data = await searchAdvocates(params);
      setFilteredAdvocates(data);
    } catch (searchError) {
      console.error('Search failed:', searchError);
    }
  }, [searchAdvocates, clearError]);

  const handleSort = useCallback((field: SortableField) => {
    let newSortState: SortState;
    
    if (sortState.field === field) {
      
      if (sortState.direction === SORT_DIRECTIONS.ASC) {
        newSortState = { field, direction: SORT_DIRECTIONS.DESC };
      } else if (sortState.direction === SORT_DIRECTIONS.DESC) {
        newSortState = { field: null, direction: null }; 
      } else {
        newSortState = { field, direction: SORT_DIRECTIONS.ASC };
      }
    } else {
      
      newSortState = { field, direction: SORT_DIRECTIONS.ASC };
    }
    
    setSortState(newSortState);
    performSearch(searchTerm, newSortState);
  }, [sortState, searchTerm, performSearch]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  const handleSearchClick = useCallback(() => {
    performSearch(searchTerm, sortState);
  }, [performSearch, searchTerm, sortState]);

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setSortState({ field: null, direction: null });
    setFilteredAdvocates(advocates);
    clearError();
  }, [advocates, clearError]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-full overflow-hidden">
        <Title level={1} className="mb-6 text-blue-500">
          Solace Advocates
        </Title>
        
        <div className="mb-6">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Text strong>Search Advocates</Text>
              <div className="mt-2">
                <Text type="secondary">
                  Currently searching for: <span data-testid="search-term" className="font-bold">{searchTerm || "All advocates"}</span>
                  {sortState.field && sortState.direction && (
                    <>
                      <br />
                      <span className="text-blue-500">
                        Sorted by: {sortState.field} ({sortState.direction === SORT_DIRECTIONS.ASC ? "ascending" : "descending"})
                      </span>
                    </>
                  )}
                </Text>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-lg">
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                onPressEnter={handleSearchClick}
                disabled={isLoading}
                placeholder="Search by name, city, degree, or specialty..."
                prefix={<SearchOutlined />}
                size="large"
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button 
                  type="primary"
                  onClick={handleSearchClick} 
                  disabled={isLoading}
                  loading={isLoading}
                  size="large"
                  icon={<SearchOutlined />}
                  className="flex-shrink-0"
                >
                  Search
                </Button>
                <Button 
                  onClick={handleReset} 
                  disabled={isLoading}
                  size="large"
                  icon={<ReloadOutlined />}
                  className="flex-shrink-0"
                >
                  Reset
                </Button>
              </div>
            </div>

            {error && (
              <Alert
                message="Search Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={clearError}
              />
            )}
          </Space>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader currentSort={sortState} onSort={handleSort} />
            <TableBody advocates={filteredAdvocates} isLoading={isLoading} />
          </Table>
        </div>
      </div>
    </div>
  );
} 