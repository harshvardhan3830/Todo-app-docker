import { useEffect, useState } from "react";
import AddTodo from "./AddTodo";
import { TodoInterface } from "../interfaces/TodoInterface";
import TodoListViewer from "./TodoListViewer";
import { getTodos } from "../apis/todoApi";

const ToDoList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<Boolean>(false);
  const [todos, setTodos] = useState<TodoInterface[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-4/5 py-3 flex flex-col ">
      <div className=" h-20 w-full flex justify-between items-center">
        <h1 className=" text-5xl">Task List</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10"
          onClick={() => setIsDialogOpen(true)}
        >
          Add Task
        </button>
      </div>
      {isDialogOpen && (
        <AddTodo setIsDialogOpen={setIsDialogOpen} setTodos={setTodos} />
      )}
      <div className="w-full h-fit-content mt-10">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoListViewer key={todo?._id} todo={todo} setTodos={setTodos} />
          ))
        ) : (
          <div className="text-2xl text-center">No Tasks Yet</div>
        )}
      </div>
    </div>
  );
};

export default ToDoList;
