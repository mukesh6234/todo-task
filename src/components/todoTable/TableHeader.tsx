import { flexRender } from "@tanstack/react-table";
import React from "react";
import { Table } from "@tanstack/react-table";

interface TableHeaderProps<TData extends object> {
  table: Table<TData>;
}

const TableHeader: React.FC<TableHeaderProps<any>> = ({ table }) => {
  return (
    <thead style={{ backgroundColor: "#f8f9fa" }}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              style={{
                padding: "10px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default TableHeader;
