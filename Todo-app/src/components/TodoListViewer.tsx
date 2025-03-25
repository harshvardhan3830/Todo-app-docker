import { TrashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { deleteTodo, updateTodo } from "../apis/todoApi";

const TodoListViewer = ({ todo, setTodos }: any) => {
  console.log(todo);
  const dateObj = new Date(todo?.date);

  const year = dateObj.getFullYear(); // 2025
  const month = dateObj.toLocaleString("en-US", { month: "long" }); // March
  const day = dateObj.getDate(); // 26

  const handleComplete = async () => {
    try {
      await updateTodo(todo._id, { ...todo, completed: true });
      setTodos((prevTodos: any) =>
        prevTodos.map((prevTodo: any) =>
          prevTodo._id === todo._id
            ? { ...prevTodo, completed: true }
            : prevTodo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo._id);
      setTodos((prevTodos: any) =>
        prevTodos.filter((prevTodo: any) => prevTodo._id !== todo._id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between items-center w-full p-2 border-b-2 border-gray-300">
      <div className="w-1/10  flex flex-col justify-center items-center border-2 border-gray-300 px-5 py-2 rounded-xl bg-gray-500">
        <div>{month}</div>
        <div className=" text-4xl font-bold">{day}</div>
        <div>{year}</div>
        {/* <div>{todo.time}</div> */}
      </div>
      <div className="w-7/10 ">
        <div className="text-4xl mb-2 capitalize">{todo?.title}</div>
        <div>{todo?.description}</div>
      </div>
      <div className="w-1/10 flex gap-4 relative">
        {/* CheckCircleIcon with tooltip */}
        <button
          className="relative group cursor-pointer"
          onClick={handleComplete}
          disabled={todo?.completed}
        >
          <CheckCircleIcon
            className={
              todo?.completed
                ? "w-8 h-8 text-gray-400"
                : "w-8 h-8 text-green-500"
            }
          />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block p-2 text-white text-sm bg-gray-800 rounded-md shadow-lg">
            {todo?.completed ? "Completed" : "Mark completed"}
          </span>
        </button>

        {/* TrashIcon with tooltip */}
        <button
          className="relative group cursor-pointer"
          onClick={handleDelete}
        >
          <TrashIcon className="w-8 h-8 text-red-500" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block p-2 text-white text-sm bg-gray-800 rounded-md shadow-lg">
            Delete Task
          </span>
        </button>
      </div>
    </div>
  );
};

export default TodoListViewer;
