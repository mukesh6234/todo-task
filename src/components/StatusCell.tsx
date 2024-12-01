import { InputGroup } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { Row, Column, Table } from "@tanstack/react-table"; 

interface Todo {
    task: string;
    status: string;
    children?: Todo[];
  }

interface EditableCellProps {
    getValue: () => string;
    row: Row<Todo>; 
    column: Column<Todo, unknown>; 
    table: Table<Todo>; 
  }

const EditableCell: React.FC<EditableCellProps> = ({
  getValue,
  row,
  column,
  table,
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
    setIsFocused(false);
  };

  return (
    <InputGroup
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        border: "none",
        boxShadow: !isFocused ? "none" : "",
      }}
      fill
      onFocus={() => setIsFocused(true)}
      onBlur={onBlur}
    />
  );
};

export default EditableCell;
