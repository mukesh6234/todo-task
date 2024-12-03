import { Menu, MenuItem } from "@blueprintjs/core";
import React from "react";

interface StatusMenuProps {
  onSelect: (newValue: string) => void;
}

const StatusMenu: React.FC<StatusMenuProps> = ({ onSelect }) => {
  
  const handleStatusChange = (
    newStatus: "Pending" | "In Progress" | "Completed"
  ) => {
    onSelect(newStatus);
  };

  return (
    <Menu>
      <MenuItem text="Pending" onClick={() => handleStatusChange("Pending")} />
      <MenuItem
        text="In Progress"
        onClick={() => handleStatusChange("In Progress")}
      />
      <MenuItem
        text="Completed"
        onClick={() => handleStatusChange("Completed")}
      />
    </Menu>
  );
};

export default StatusMenu;
