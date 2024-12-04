import { InputGroup } from "@blueprintjs/core";
import React, { useState } from "react";
import { showErrorToast } from "./Toaster";

interface EditableCellProps {
  value: string;
  onSave: (newValue: string) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onSave }) => {
  const [editingValue, setEditingValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveCell = () => {
    if (editingValue !== value) {
      onSave(editingValue);
    }
    if (editingValue === "") {
      showErrorToast("Field is required!")
    }
    setIsEditing(false);
  };

  return (isEditing || !value) ? (
    <InputGroup
      value={editingValue}
      onChange={(e) => setEditingValue(e.target.value)}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        border: "none",
      }}
      fill
      onBlur={() => {
        handleSaveCell();
      }}
      placeholder="Add a task"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSaveCell();
        }
      }}
    />
  ) : (
    <div onDoubleClick={() => setIsEditing(true)} style={{ width: "100%" }}>
      {editingValue || value}
    </div>
  );
};

export default EditableCell;
