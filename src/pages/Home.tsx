import React, { useCallback, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import TableNav from "../components/todoTable/TableNav";
import TableContent from "../components/todoTable/TableContent";
import { todoColumns } from "../components/todoTable/TableColumn";
import useDebounce from "../hooks/useDebounce ";
import { api } from "../api/MakeRequest";
import Navbar from "../components/Navbar";
import { catchBlockError } from "../utils/helper";
import { showErrorToast, showSuccessToast } from "../components/Toaster";

export interface Todo {
  _id: string;
  title: string;
  status: string;
  parentTodoId?: string | null;
  childrenIds?: Todo[];
  isDeleted?: boolean;
}

export interface TodoResponse {
  _id: string;
  title: string;
  status: string;
  parentTodoId?: string | null;
  childrenIds?: TodoResponse[];
  isDeleted?: boolean;
}

const Home: React.FC = () => {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [todoTask, setTodoTask] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const debouncedQuery = useDebounce(searchValue, 500);

  useEffect(() => {
    fetchTodos();
  }, [debouncedQuery]);

  const fetchTodos = async () => {
    try {
      const todosResponse = await api.get<TodoResponse[]>(
        `/todos?title=${debouncedQuery}`
      );
      setTodos(todosResponse);
    } catch (err) {
      catchBlockError(err);
    }
  };

  const handleCreateTask = useCallback(async () => {
    if (todoTask) {
      const reqBody = {
        title: todoTask,
        parentTodoId: null,
      };
      try {
        const response = await api.post(`/todos`, reqBody);
        console.log(response);
        showSuccessToast("Created Successfully!");
        fetchTodos();
        setTodoTask("");
      } catch (err) {
        catchBlockError(err);
      }
    } else {
      showErrorToast("Invalid Data");
    }
  }, [todoTask]);

  const handleUpdateTask = useCallback(
    async (id: string, updatedData: Partial<TodoResponse>) => {
      console.log(updatedData, "updatedData");
      const { title, status } = updatedData;
      if (title && status) {
        try {
          const response = await api.put(`/todos/${id}`, updatedData);
          console.log(response);
          showSuccessToast("Updated Successfully!");
          fetchTodos();
        } catch (err) {
          catchBlockError(err);
        }
      } else {
        showErrorToast("Invalid Data");
      }
    },
    []
  );

  const handleRemoveTask = useCallback(async (id: string) => {
    if (id) {
      try {
        const response = await api.delete(`/todos/${id}`);
        console.log(response);
        showSuccessToast("Removed Successfully!");
        fetchTodos();
      } catch (err) {
        catchBlockError(err);
      }
    } else {
      showErrorToast("Invalid Task");
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTask(e.target.value);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  const handleAddSubRow = (parentId: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === parentId
          ? {
              ...todo,
              childrenIds: [
                ...(todo.childrenIds || []),
                {
                  _id: `temp-${Date.now()}`,
                  title: "New Sub Task",
                  status: "Pending",
                  parentTodoId: parentId,
                  childrenIds: [],
                  isDeleted: false,
                },
              ],
            }
          : todo
      )
    );
  };

  const table = useReactTable({
    data: todos,
    columns: todoColumns(handleUpdateTask, handleRemoveTask, handleAddSubRow),
    getCoreRowModel: getCoreRowModel(),
    getSubRows: (row) => row.childrenIds || [],
  });
  
  return (
    <div>
      <Navbar />
      <h1 style={{ textAlign: "center" }}>My Todo List</h1>
      <TableNav
        task={todoTask}
        handleChange={handleChange}
        search={searchValue}
        handleDebounce={handleSearch}
        handleCreate={handleCreateTask}
      />
      <TableContent table={table} refetchData={fetchTodos} />
    </div>
  );
};

export default Home;
