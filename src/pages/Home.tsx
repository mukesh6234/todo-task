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
import LoadingBackdrop from "../components/LoadingBackdrop";
import { useAuth } from "../context/AuthContext";

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
  const { isSubmitting, setIsSubmitting } = useAuth();
  const [isFetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    setFetching(true);
    fetchTodos();
  }, [debouncedQuery]);

  const fetchTodos = async () => {
    try {
      const todosResponse = await api.get<TodoResponse[]>(
        `/todos?title=${debouncedQuery}`
      );
      setTodos(todosResponse);
      setFetching(false);
    } catch (err) {
      catchBlockError(err);
    }
  };

  const handleCreateTask = useCallback(async () => {
    if (!todoTask) {
      showErrorToast("Invalid Data");
      return;
    }
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  }, [todoTask]);

  const handleUpdateTask = useCallback(
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
        fetchTodos();
      } catch (err) {
        catchBlockError(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const handleRemoveTask = useCallback(async (id: string) => {
    if (!id) {
      showErrorToast("Invalid Data");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.delete(`/todos/${id}`);
      console.log(response);
      showSuccessToast("Removed Successfully!");
      fetchTodos();
    } catch (err) {
      catchBlockError(err);
    } finally {
      setIsSubmitting(false);
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
                  title: "",
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
    <div style={{ paddingTop: "10px" }}>
      {(isFetching || isSubmitting) && <LoadingBackdrop />}
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
