import React, { useMemo, useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
} from "@tanstack/react-table";
import { Button } from "@blueprintjs/core";
import EditableCell from "../components/EditableCell";
import StatusCell from "../components/StatusCell";

interface Todo {
  id: number;
  task: string;
  status: string;
  children?: Todo[];
}

const data: Todo[] = [
  {
    id: 1,
    task: "Build React App",
    status: "In Progress",
    children: [
      { id: 11, task: "Set up project structure", status: "Completed" },
      { id: 12, task: "Add components", status: "In Progress" },
    ],
  },
  {
    id: 2,
    task: "Write Documentation",
    status: "Pending",
    children: [
      { id: 21, task: "API Documentation", status: "Pending" },
      { id: 22, task: "User Guide", status: "Pending" },
    ],
  },
  {
    id: 3,
    task: "Deploy App",
    status: "Not Started",
    children: [],
  },
];

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Todo>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );
  },
};

const Home: React.FC = () => {
  // Define column structure
  const [todos, setTodos] = useState<Todo[]>(data);
  console.log(todos,"todostodos");
  
  const columns = useMemo<ColumnDef<Todo>[]>(
    () => [
      {
        id: "number",
        header: "No.",
        cell: ({ row }) =>
          row.depth === 0
            ? row.index + 1
            : `${row?.index + 1}.${row.index + 1}`,
      },
      {
        accessorKey: "task",
        header: "Task",
        cell: ({ row, getValue, column, table }) => {
          const value = getValue<string>();
          return (
            <div
              style={{
                // Since rows are flattened by default,
                // we can use the row.depth property
                // and paddingLeft to visually indicate the depth
                // of the row
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <EditableCell
                  getValue={() => value}
                  row={row}
                  column={column}
                  table={table}
                />
                {row.getCanExpand() ? (
                  <Button
                    onClick={row.getToggleExpandedHandler()}
                    style={{ cursor: "pointer" }}
                    icon={
                      row.getIsExpanded() ? "chevron-down" : "chevron-right"
                    } // Blueprint.js icons
                    minimal
                  />
                ) : null}{" "}
              </div>
            </div>
          );
        },
        footer: (props) => props.column.id,
      },
      // {
      //   id: "expander",
      //   header: () => null,
      //   cell: ({ row }) =>
      //     row.getCanExpand() ? (
      //       <button
      //         onClick={row.getToggleExpandedHandler()}
      //         style={{
      //           cursor: "pointer",
      //           background: "none",
      //           border: "none",
      //           fontSize: "1rem",
      //         }}
      //       >
      //         {row.getIsExpanded() ? "▼" : "▶"}
      //       </button>
      //     ) : null,
      // },
      // {
      //   accessorKey: "task",
      //   header: "Task",
      // },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row, getValue, column, table }) => {
          const value = getValue<string>();
          return (
            <StatusCell
              getValue={() => value}
              row={row}
              column={column}
              table={table}
            />
          );
        },
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "delete",
        header: "Delete",
        cell: ({ row, getValue }) => (
          <Button
            intent="danger"
            small
            outlined
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
            icon="delete"
          />
        ),
      },
    ],
    []
  );

  // Create the table instance
  const table = useReactTable({
    data: todos,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getSubRows: (row) => row.children, // Define how to access children rows
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        // Skip page index reset until after next rerender
        // skipAutoResetPageIndex()
        setTodos((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });
  console.log(table.getRowModel().rows, "ssssssssssssss");

  return (
    <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>My Todo List</h1>
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <tr>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: "10px" }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {/* Render child tasks */}
              {row.getIsExpanded() && row.subRows.length > 0 && (
                <>
                  {/* <tr>
                    <td
                      colSpan={columns.length}
                      style={{
                        padding: "10px",
                        backgroundColor: "#e9ecef",
                        fontWeight: "bold",
                      }}
                    >
                      Subtasks for "{row.original.task}"
                    </td>
                  </tr> */}
                  {row.subRows.map((subRow) => (
                    <tr key={subRow.id}>
                      <td style={{ padding: "10px", textAlign: "left" }}>
                        {subRow?.parentId ? parseInt(subRow?.parentId) + 1 : 1}.
                        {subRow.index + 1}
                      </td>

                      <td style={{ padding: "10px", paddingLeft: "20px" }}>
                        {subRow.original.task}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {subRow.original.status}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <Button
                          intent="danger"
                          small
                          outlined
                          {...{
                            onClick: row.getToggleExpandedHandler(),
                            style: { cursor: "pointer" },
                          }}
                          icon="delete"
                        />
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
