import { Table } from "@tanstack/react-table";
import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface TableContentProps<TData extends object> {
  table: Table<TData>;
  refetchData: () => void;
}

const TableContent: React.FC<TableContentProps<any>> = ({
  table,
  refetchData,
}) => {
  return (
    <table
      border={1}
      cellPadding="10"
      cellSpacing="0"
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
      }}
    >
      <TableHeader table={table} />

      <tbody>
        <TableRow table={table} refetchData={refetchData} />
      </tbody>
    </table>
  );
};

export default TableContent;
