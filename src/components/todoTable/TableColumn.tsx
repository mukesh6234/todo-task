import { Button, Intent, Popover, Position } from "@blueprintjs/core";
import { ColumnDef } from "@tanstack/react-table";
import StatusMenu from "../StatusMenu";
import EditableCell from "../EditableCell";
import { Todo, TodoResponse } from "../../pages/Home";

export interface StatusColor {
  Pending: Intent;
  "In Progress": Intent;
  Completed: Intent;
}

export const statusColor: StatusColor = {
  Pending: "primary",
  "In Progress": "warning",
  Completed: "success",
};

export const todoColumns = (
  handleUpdateTask: (id: string, updatedData: Partial<Todo>) => void,
  handleRemoveTask: (id: string) => void,
  handleAddSubRow: (parentId: string) => void
): ColumnDef<TodoResponse>[] => [
  {
    id: "number",
    header: "No.",
    cell: ({ row }) => {
      const parentIndex = row.depth > 0 ? row?.index + 1 : row.index + 1;
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <div>
            {row.depth > 0
              ? `${parentIndex}.${row.index + 1}`
              : `${row.index + 1}`}
          </div>
          {row.getCanExpand() && (
            <Button
              onClick={row.getToggleExpandedHandler()}
              style={{ cursor: "pointer" }}
              small
              icon={row.getIsExpanded() ? "chevron-down" : "chevron-right"}
              minimal
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Task",
    cell: ({ row, getValue }) => {
      const value = getValue() as string;
      const status = row.original.status as keyof StatusColor;
      return (
        <div style={{ paddingLeft: `${row.depth * 2}rem` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 5,
            }}
          >
            <EditableCell
              value={value}
              onSave={(newValue) => {
                handleUpdateTask(row.original._id, { title: newValue, status });
              }}
            />
            <Button
              onClick={() => {
                handleAddSubRow(row.original._id);
              }}
              style={{ cursor: "pointer" }}
              small
              icon={"plus"}
              minimal
            />
          </div>
        </div>
      );
    },
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.original.title as string;
      const status = row.original.status as keyof StatusColor;
      return (
        <Popover
          position={Position.BOTTOM}
          content={
            <StatusMenu
              onSelect={(newStatus) => {
                handleUpdateTask(row.original._id, {
                  status: newStatus,
                  title: value,
                });
              }}
            />
          }
        >
          <Button text={status} intent={statusColor[status] || "primary"} />
        </Popover>
      );
    },
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "delete",
    header: "Manage",
    cell: ({ row }) => (
      <Button
        intent="danger"
        small
        outlined
        style={{ cursor: "pointer" }}
        onClick={() => {
          handleRemoveTask(row.original._id);
        }}
        icon="trash"
        minimal
      />
    ),
  },
];
