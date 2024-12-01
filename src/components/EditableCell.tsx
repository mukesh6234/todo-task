import { InputGroup, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { Row, Column, Table } from "@tanstack/react-table"; 

interface Todo {
    task: string;
    status: string;
    children?: Todo[];
  }

interface StatusCellProps {
    getValue: () => string;
    row: Row<Todo>; 
    column: Column<Todo, unknown>; 
    table: Table<Todo>; 
  }

const StatusCell: React.FC<StatusCellProps> = ({
  getValue,
  row,
  column,
  table,
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleClick = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  return (
    <Menu>
    <MenuItem icon="new-text-box" onClick={handleClick} text="New text box" />
    <MenuItem icon="new-object" onClick={handleClick} text="New object" />
    <MenuItem icon="new-link" onClick={handleClick} text="New link" />
    <MenuDivider />
    <MenuItem text="Settings..." icon="cog" intent="primary">
        <MenuItem icon="tick" text="Save on edit" />
        <MenuItem icon="blank" text="Compile on edit" />
    </MenuItem>
</Menu>
  );
};

export default StatusCell;
