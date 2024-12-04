import { Button, Popover, Position } from "@blueprintjs/core";
import { Row } from "@tanstack/react-table";
import React, { useCallback } from "react";
import StatusMenu from "../StatusMenu";
import { StatusColor, statusColor } from "./TableColumn";
import { api } from "../../api/MakeRequest";
import { TodoResponse } from "../../pages/Home";
import EditableCell from "../EditableCell";
import { showErrorToast, showSuccessToast } from "../Toaster";
import { catchBlockError } from "../../utils/helper";
import { useAuth } from "../../context/AuthContext";

interface TableSubRowProps<TData extends object> {
  row: Row<TData>;
  refetchData: () => void;
}

const TableSubRow: React.FC<TableSubRowProps<any>> = ({ row, refetchData }) => {
  const { setIsSubmitting } = useAuth();

  const handleCreateSubTask = async (updatedData: Partial<TodoResponse>) => {
    const { title, status, parentTodoId } = updatedData;
    if (!title || !status || !parentTodoId) {
      showErrorToast("Invalid Data");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.post(`/todos`, updatedData);
      console.log(response);
      showSuccessToast("Created Successfully!");
      refetchData();
    } catch (err) {
      catchBlockError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubTask = useCallback(
    async (id: string, updatedData: Partial<TodoResponse>) => {
      console.log(updatedData, "updatedData");
      const { title, status } = updatedData;
      if (!title || !status) {
        showErrorToast("Invalid Data");
        return;
      }
      setIsSubmitting(true);
      try {
        const response = await api.put(`/todos/${id}`, updatedData);
        console.log(response);
        showSuccessToast("Updated Successfully!");
        refetchData();
      } catch (err) {
        catchBlockError(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const handleRemoveSubTask = useCallback(async (id: string) => {
    if (!id) {
      showErrorToast("Invalid Data");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.delete(`/todos/${id}`);
      console.log(response);
      showSuccessToast("Removed Successfully!");
      refetchData();
    } catch (err) {
      catchBlockError(err);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <>
      {row.getIsExpanded() && row.subRows.length > 0 && (
        <>
          {row.subRows.map((subRow) => (
            <tr key={subRow.id}>
              <td style={{ padding: "10px", textAlign: "left" }}>
                {subRow.parentId ? parseInt(subRow.parentId) + 1 : 1}.
                {subRow.index + 1}
              </td>
              <td style={{ padding: "10px", paddingLeft: "20px" }}>
                <EditableCell
                  value={subRow.original.title}
                  onSave={(newValue) => {
                    const rowId = subRow.original._id;
                    let updateValue: {
                      title: string;
                      status: any;
                      parentTodoId?: string;
                    } = {
                      title: newValue,
                      status: subRow.original.status,
                    };
                    if (rowId.includes("temp")) {
                      updateValue.parentTodoId = subRow.original.parentTodoId;
                      handleCreateSubTask(updateValue);
                    } else {
                      handleUpdateSubTask(rowId, updateValue);
                    }
                  }}
                />
              </td>
              <td style={{ padding: "10px" }}>
                <Popover
                  position={Position.BOTTOM}
                  content={
                    <StatusMenu
                      onSelect={(newStatus) => {
                        const rowId = subRow.original._id;
                        let updateValue: {
                          title: string;
                          status: any;
                          parentTodoId?: string;
                        } = {
                          status: newStatus,
                          title: subRow.original.title,
                        };
                        if (rowId.includes("temp")) {
                          updateValue.parentTodoId =
                            subRow.original.parentTodoId;
                          handleCreateSubTask(updateValue);
                        } else {
                          handleUpdateSubTask(rowId, updateValue);
                        }
                      }}
                    />
                  }
                >
                  <Button
                    text={subRow.original.status}
                    intent={
                      statusColor[
                        subRow.original.status as keyof StatusColor
                      ] || "primary"
                    }
                  />
                </Popover>
              </td>
              <td style={{ padding: "10px" }}>
                <Button
                  intent="danger"
                  small
                  outlined
                  onClick={() => {
                    handleRemoveSubTask(subRow.original._id);
                  }}
                  style={{ cursor: "pointer" }}
                  icon="trash"
                  minimal
                />
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  );
};

export default TableSubRow;
