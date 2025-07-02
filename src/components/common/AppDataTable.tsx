// Install: npm install @tanstack/react-table

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

// Generic column configuration
interface ColumnConfig<T> {
  excludeKeys?: (keyof T)[];
  customColumns?: Partial<Record<keyof T, Partial<ColumnDef<T>>>>;
  keyMappings?: Partial<Record<keyof T, string>>;
}

// Utility functions
const getValueType = (value: any): string => {
  if (value === null || value === undefined) return "string";
  if (value instanceof Date) return "date";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  return "string";
};

const formatHeader = (key: string): string => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Custom sorting function for booleans
const booleanSortingFn = (rowA: any, rowB: any, columnId: string) => {
  const valueA = rowA.getValue(columnId);
  const valueB = rowB.getValue(columnId);

  // Convert booleans to numbers for consistent sorting
  // true becomes 1, false becomes 0, null/undefined becomes -1
  const numA = valueA === null || valueA === undefined ? -1 : Number(valueA);
  const numB = valueB === null || valueB === undefined ? -1 : Number(valueB);

  return numA - numB;
};

// Default cell renderers by type
const getDefaultCell = <T,>(type: string) => {
  const cellRenderers = {
    string: ({ getValue }: { getValue: () => any }) => {
      const value = getValue() as string;
      const isLongText = value && value.length > 50;
      return (
        <div
          className={`text-gray-900 ${isLongText ? "truncate max-w-sm" : ""}`}
        >
          {value || "—"}
        </div>
      );
    },
    number: ({ getValue }: { getValue: () => any }) => {
      const value = getValue() as number;
      return (
        <div className="text-right font-medium text-gray-900">
          {value?.toLocaleString() || "0"}
        </div>
      );
    },
    date: ({ getValue }: { getValue: () => any }) => {
      const value = getValue() as Date;
      return (
        <div className="text-gray-500 text-sm">
          {value
            ? value.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—"}
        </div>
      );
    },
    boolean: ({ getValue }: { getValue: () => any }) => {
      const value = getValue() as boolean;
      return (
        <div className="flex justify-center">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              value
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        </div>
      );
    },
  };

  return (
    cellRenderers[type as keyof typeof cellRenderers] || cellRenderers.string
  );
};

// Get sorting function based on value type
const getSortingFn = (valueType: string) => {
  switch (valueType) {
    case "date":
      return "datetime";
    case "boolean":
      return booleanSortingFn;
    case "number":
      return "alphanumeric"; // This works well for numbers
    default:
      return "alphanumeric";
  }
};

// Generic column generator for TanStack Table
const generateColumns = <T extends Record<string, any>>(
  sampleData: T[],
  config: ColumnConfig<T> = {}
): ColumnDef<T>[] => {
  if (!sampleData || sampleData.length === 0) return [];

  const { excludeKeys = [], customColumns = {}, keyMappings = {} } = config;
  const firstItem = sampleData[0];

  if (!firstItem) return [];

  const columnHelper = createColumnHelper<T>();

  return Object.keys(firstItem)
    .filter((key) => !excludeKeys.includes(key as keyof T))
    .map((key) => {
      const typedKey = key as keyof T;
      const sampleValue = firstItem[typedKey];
      const valueType = getValueType(sampleValue);

      // Base column configuration
      const baseColumn = columnHelper.accessor(typedKey as any, {
        header:
          (keyMappings as Record<string, string>)[key] || formatHeader(key),
        cell: getDefaultCell<T>(valueType),
        enableSorting: true,
        sortingFn: getSortingFn(valueType),
      });

      // Merge with custom configuration if provided
      const customConfig = (customColumns as Record<string, any>)[key];
      if (customConfig) {
        return {
          ...baseColumn,
          ...customConfig,
          // Keep the sorting function unless explicitly overridden
          sortingFn: customConfig.sortingFn || baseColumn.sortingFn,
        } as ColumnDef<T>;
      }

      return baseColumn;
    });
};

// Sort icon component
const SortIcon: React.FC<{ isSorted: false | "asc" | "desc" }> = ({
  isSorted,
}) => {
  if (isSorted === "asc") return <span className="text-gray-600">↑</span>;
  if (isSorted === "desc") return <span className="text-gray-600">↓</span>;
  return <span className="text-gray-400">↕</span>;
};

// Generic Table Component
interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  config?: ColumnConfig<T>;
  title?: string;
  description?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  config = {},
  title = "Data Table",
  description,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => generateColumns(data, config), [data, config]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Register custom sorting functions
    sortingFns: {
      booleanSort: booleanSortingFn,
    },
    debugTable: false,
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">
          {description ||
            `Click on column headers to sort. Showing ${data.length} items.`}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        header.column.getCanSort()
                          ? "cursor-pointer select-none hover:bg-gray-100 transition-colors"
                          : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <SortIcon isSorted={header.column.getIsSorted()} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No data found.</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Sorted by:{" "}
          {sorting.length > 0
            ? sorting
                .map((s) => `${s.id} (${s.desc ? "desc" : "asc"})`)
                .join(", ")
            : "None"}
        </p>
      </div>
    </div>
  );
};

export default DataTable;
