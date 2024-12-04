import { Button, InputGroup } from "@blueprintjs/core";
import React from "react";

interface TableNavProps {
  task: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  search: string;
  handleDebounce: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreate: () => void;
}

const TableNav: React.FC<TableNavProps> = ({
  task,
  handleChange,
  search,
  handleDebounce,
  handleCreate,
}) => {
  return (
    <div className="table-input-header">
      <div style={{ display: "flex", alignItems: "center", gap: 10,width:"100%" }}>
        <InputGroup
          id="create-task"
          placeholder="Create a new todo"
          type="text"
          name="create-task"
          value={task}
          onChange={handleChange}
        />
        <Button
          intent="primary"
          text="Create"
          type="submit"
          icon={"tick-circle"}
          onClick={handleCreate}
        />
      </div>
      <InputGroup
        id="search"
        placeholder="Search..."
        type="text"
        name="search"
        value={search}
        onChange={handleDebounce}
        leftIcon="search"
      />
    </div>
  );
};

export default TableNav;
