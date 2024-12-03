import { flexRender, Table } from "@tanstack/react-table";
import React from "react";
import TableSubRow from "./TableSubRow";
import { todoColumns } from "./TableColumn";

interface TableRowProps<TData extends object> {
  table: Table<TData>;
  refetchData: () => void;
}

const TableRow: React.FC<TableRowProps<any>> = ({ table, refetchData }) => {
  return (
    <>
      {table.getRowModel().rows.length > 0 ? (
        table.getRowModel().rows.map((row) => (
          <React.Fragment key={row.id}>
            <tr>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ padding: "10px" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
            {row.getIsExpanded() && row.subRows.length > 0 && (
              <TableSubRow row={row} refetchData={refetchData} />
            )}
          </React.Fragment>
        ))
      ) : (
        <tr>
          <td colSpan={todoColumns.length + 1} style={{ textAlign: "center" }}>
            No records found !
          </td>
        </tr>
      )}
    </>
  );
};

export default TableRow;
